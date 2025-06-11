import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  WritableSignal,
  signal,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MatDialog } from '@angular/material/dialog';

import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';
import { ContactPersonDetailsComponent } from '../contact-person-details/contact-person-details.component';
import { ObservationContentComponent } from '../observation-content/observation-content.component';
import { OverviewComponent } from '../overview/overview.component';
import { SendBackReasonsComponent } from '../sendback-reasons/sendback-reasons.component';

import { differenceInCalendarDays } from 'date-fns';

import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

/* ------------------------------------------------------------------ */
/* Helper types / constants                                           */
/* ------------------------------------------------------------------ */
interface FiscalYear {
  date: string;
}
interface MergeResponse {
  obsResponse: string;
  obsType: 'NEW' | 'REPEATED';
  completionYear: string;
  prevCompletionYear?: string;
  prevGovtEntity?: string;
  govtEntity?: string;
  stepId: string;
  displayName: string;
  title: string;
  reportCycle: string;
  reportName: string;
  obsSeq: number;
  obsCategory?: string;
  departmentCode?: number;
  isDateFieldSelected?: boolean;
}

const SPECIAL_YEARS = [
  'متباين الرأى بشأنها',
  'تتعلق بجهات حكومية/اخرى',
  'تم الانتهاء من إجراءاتها',
] as const;
type SpecialYear = (typeof SPECIAL_YEARS)[number];

@Component({
  selector: 'app-combine-responses',
  templateUrl: './combine-responses.component.html',
  styleUrls: ['./combine-responses.component.css'],
  standalone: true,
  imports: [SharedModule, CKEditorModule],
})
export class CombineResponsesComponent implements OnInit {
  /* ----------------------------------------------------------------
   * DI & teardown
   * -------------------------------------------------------------- */
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  public readonly router = inject(Router);
  private readonly core = inject(CoreService);
  private readonly shared = inject(SharedVariableService);
  private readonly loader = inject(LoadingService);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NzNotificationService);

  /* ----------------------------------------------------------------
   * Public template state (signals)
   * -------------------------------------------------------------- */
  readonly Editor: any = ClassicEditor;
  readonly isLoading = signal(true);
  readonly isRtl = signal(false);

  /* fetched merge responses */
  readonly mergeData: WritableSignal<MergeResponse[]> = signal([]);

  /* Selected tab / response */
  readonly selectedResponse = signal<MergeResponse | null>(null);

  /* CKEditor content */
  readonly combineDataRTL = signal('');
  private previousCombineData = '';

  /* Form fields */
  readonly fiscalYears: WritableSignal<FiscalYear[]> = signal([]);
  /* selected date string from dropdown (could be special) */
  readonly date = signal<string>('');
  readonly isDateFieldSelected = signal(true);

  /* gov-entity chips */
  readonly entities: WritableSignal<string[]> = signal([]);

  /* ----------------------------------------------------------------
   * Raw user / route context
   * -------------------------------------------------------------- */
  private userInfo!: any; // sabUserInformation (raw)
  private delegateInfo: any = null; // sabDelegateUser
  private customerId = ''; // route param stepCustomId

  /* cached context for _onComplete() payload */
  private stepIds: string[] = [];
  public classification = '';
  public obsType: 'NEW' | 'REPEATED' = 'NEW';
  private obsCategory = '';
  private deptCode = 0;
  public reportCycle = '';
  private userId = '';
  private userJobTitle = '';
  public isAdmin = false;
  public sabContent: any = {};

  public isSecretary: string = 'No';

  public govtEntity: string = '';

  public isPreviouseDataPresent = false;

  /* ----------------------------------------------------------------
   * CKEditor whitelist config
   * -------------------------------------------------------------- */
  readonly editorConfig = {
    fontFamily: { options: ['Times New Roman, Times, serif'] },
    fontSize: { options: [12] },
    toolbar: ['undo', 'redo'],
    language: 'ar',
  };

  /* ----------------------------------------------------------------
   * Lifecycle
   * -------------------------------------------------------------- */
  ngOnInit(): void {
    this.bootstrapUserContext();
    this.listenRtl();
    this.listenRoute();
  }

  /* ----------------------------------------------------------------
   * UI helpers (template-bound)
   * -------------------------------------------------------------- */

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  /** Tab change (mergeData index) */
  selectionChange({ index }: { index: number }): void {
    const res = this.mergeData()[index];
    this.selectedResponse.set(res);
    this.checkPreviousDataPresence(res);
  }

  /** Append current tab’s response into CKEditor content */
  addCombinedata(): void {
    const current = this.selectedResponse();
    if (current) {
      this.combineDataRTL.set(this.combineDataRTL() + current.obsResponse);
    }
  }

  /** Add gov-entity chip */
  addChip(entity: string): void {
    const trimmed = entity.trim();
    if (!trimmed) return;
    this.entities.update((l) => [...l, trimmed]);
    this.govtEntity = '';
  }

  /** Remove chip */
  remove(entity: string): void {
    this.entities.update((list) => list.filter((e) => e !== entity));
  }

  /** Dropdown change */
  dateChange(value: string): void {
    this.date.set(value);
    this.isDateFieldSelected.set(!SPECIAL_YEARS.includes(value as SpecialYear));
    this.updateClassification(value as string);
  }

  /** List-item click inside mat-option – we need special handling */
  checkSelected(val: string): void {
    this.dateChange(val);
  }

  /* ----------------------------------------------------------------
   * Main action
   * -------------------------------------------------------------- */
  onComplete(): void {
    /* Sanitize CKEditor result */
    const cleanText = this.combineDataRTL().trim();
    if (!cleanText) return;

    /* Trim gov-entities */
    const govEntities = this.entities()
      .map((e) => e.trim())
      .filter(Boolean);

    /* Build request payload */
    const payload = this.buildCombinePayload({
      combinedResponse: cleanText,
      completionYear: this.date(),
      govtEntity: govEntities.join(','),
    });

    const url = 'workItemController/combineResponses';
    this.toggleLoading(url, true);

    this.core
      .post(url, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toggleLoading(url, false);
          this.clearLocalFilters();
          this.router.navigate(['/inbox']);
        },
        error: (err) => {
          this.toggleLoading(url, false);
          console.error(err);
        },
      });
  }

  /* ----------------------------------------------------------------
   * Dialogs
   * -------------------------------------------------------------- */
  openGPASenBackHistoryModel(): void {
    const url =
      `InProgController/getRejectedReasons?obsId=${this.sabContent.obsId}` +
      `&reportCycle=${this.reportCycle}`;
    this.toggleLoading(url, true);
    this.core
      .get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toggleLoading(url, false);
          this.dialog.open(SendBackReasonsComponent, {
            width: '800px',
            data: res,
          });
        },
        error: (err) => this.toggleLoading(url, false, err),
      });
  }

  previousEntityDialog(): void {
    const data = this.selectedResponse();
    if (!data) return;
    this.dialog.open(PreviousEntityTypeComponent, {
      width: '450px',
      data,
    });
  }

  onShowContactPerson(): void {
    const stepName =
      this.sabContent.stepUnqName === 'G&PACOombineResponse'
        ? 'GPACombineResponse'
        : this.sabContent.stepUnqName;

    const url =
      `settingsController/getDepartmentContactPersionDetails` +
      `?obsCategory=${this.obsCategory}` +
      `&deptCode=${this.deptCode}` +
      `&stepUnqName=${stepName}` +
      `&obsId=${this.sabContent.obsId}` +
      `&reportYear=${this.sabContent.reportYear}` +
      `&reportCycle=${this.sabContent.reportCycle}`;

    this.toggleLoading(url, true);
    this.core
      .get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toggleLoading(url, false);
          this.dialog.open(ContactPersonDetailsComponent, {
            width: '800px',
            data: { dialogHeader: 'OBSERVATION_CONTACT', dialogData: res },
          });
        },
        error: (err) => this.toggleLoading(url, false, err),
      });
  }

  resoponseContent(): void {
    this.dialog.open(ObservationContentComponent, {
      width: '800px',
      data: {
        sabRequest: this.sabContent.sabRequest,
        sabCommentary: this.sabContent.sabCommentary,
      },
    });
  }

  onShowOverview(): void {
    const url =
      `InProgController/getOverViewDetailsInfo?stepCustomId=${this.customerId}` +
      `&userId=${this.userId}&r=${Math.random() * 100 + 100}`;

    this.toggleLoading(url, true);
    this.core
      .get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toggleLoading(url, false);
          this.dialog.open(OverviewComponent, { data: res });
        },
        error: (err) => this.toggleLoading(url, false, err),
      });
  }

  /* ----------------------------------------------------------------
   * CKEditor change guard
   * -------------------------------------------------------------- */
  change(html: string): void {
    const forbidden =
      html.includes('<table>') ||
      html.includes('<img') ||
      html.includes('<ul>') ||
      html.includes('<ol>') ||
      html.includes('<u>') ||
      html.includes('<b>') ||
      html.includes('<strong>');

    if (forbidden) {
      this.combineDataRTL.set(this.previousCombineData);
      this.notify.info('Info', this.forbiddenMessage(html));
      return;
    }
    this.previousCombineData = html;
  }

  /* ----------------------------------------------------------------
   * Private helpers
   * -------------------------------------------------------------- */

  private bootstrapUserContext(): void {
    /* delegate user */
    const rawDelegate = localStorage.getItem('sabDelegateUser');
    if (rawDelegate) this.delegateInfo = JSON.parse(rawDelegate);

    /* sab user information */
    const rawUser = localStorage.getItem('sabUserInformation') ?? '{}';
    this.userInfo = JSON.parse(rawUser);
    this.isAdmin = !!this.userInfo.admin;
    this.userJobTitle = this.userInfo.sabMember?.userJobTitle ?? '';
    this.userId = localStorage.getItem('loginId') ?? '';

    /* fiscal-year dropdown (current → +10) */
    const startYear = +(
      this.userInfo.reportYear?.split('-')[0] ?? new Date().getFullYear()
    );
    this.shared
      .getYears(startYear)
      .then((years) =>
        this.fiscalYears.set([
          ...SPECIAL_YEARS.map((date) => ({ date })),
          ...years,
        ])
      );
  }

  private listenRtl(): void {
    this.shared.isRtl$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rtl) => this.isRtl.set(rtl));
  }

  private listenRoute(): void {
    /* param + query in a single stream */
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm: ParamMap) => {
        this.customerId = pm.get('stepCustomId') ?? '';
        this.fetchCombineResponses();
      });

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qm) => {
        const sec = qm.get('isSecretary');
        if (sec !== null) {
          this.isSecretary = sec;
        }
      });
  }

  private fetchCombineResponses(): void {
    const url = `workItemController/getResponseToMerge?stepCustomId=${this.customerId}`;
    this.toggleLoading(url, true);
    this.core
      .get<{ data: MergeResponse[]; [k: string]: any }>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toggleLoading(url, false);
          this.sabContent = res;
          this.mergeData.set(
            res.data.map((d) => ({
              ...d,
              isDateFieldSelected: !SPECIAL_YEARS.includes(
                d.completionYear as SpecialYear
              ),
            }))
          );
          if (this.mergeData().length) {
            const first = this.mergeData()[0];
            this.selectedResponse.set(first);
            this.checkPreviousDataPresence(first);
          }
          /* populate cached vars for payload */
          this.stepIds = this.mergeData().map((d) => d.stepId);
          this.reportCycle = this.mergeData()[0]?.reportCycle ?? '';
          this.obsType = this.mergeData()[0]?.obsType ?? 'NEW';
          this.obsCategory = this.mergeData()[0]?.obsCategory ?? '';
          this.deptCode = this.mergeData()[0]?.departmentCode ?? 0;
          this.updateClassification(this.mergeData()[0]?.completionYear ?? '');
          this.isLoading.set(false);
        },
        error: (err) => this.toggleLoading(url, false, err),
      });
  }

  private updateClassification(completionYear: string): void {
    const isNew = this.obsType === 'NEW';

    const mapSpecial: Record<SpecialYear, string> = isNew
      ? {
          'متباين الرأى بشأنها': 'C',
          'تتعلق بجهات حكومية/اخرى': 'E',
          'تم الانتهاء من إجراءاتها': 'A',
        }
      : {
          'متباين الرأى بشأنها': 'CD',
          'تتعلق بجهات حكومية/اخرى': 'ED',
          'تم الانتهاء من إجراءاتها': 'A',
        };

    this.classification = SPECIAL_YEARS.includes(completionYear as SpecialYear)
      ? mapSpecial[completionYear as SpecialYear]
      : isNew
      ? 'B'
      : 'BD';
  }

  private buildCombinePayload(extra: {
    combinedResponse: string;
    completionYear: string;
    govtEntity?: string;
  }): Record<string, unknown> {
    const onBehalfLogin =
      this.delegateInfo?.loginId ??
      (this.userJobTitle === 'SEC'
        ? this.userInfo.supervisorDetails?.loginId
        : this.userInfo.sabMember?.loginId);

    return {
      userJobTitle: this.userJobTitle,
      combinedResponse: extra.combinedResponse,
      stepIds: this.stepIds,
      combinedByUserId: this.userId,
      completionYear: extra.completionYear,
      classification: this.classification,
      ...(extra.govtEntity ? { govtEntity: extra.govtEntity } : {}),
      onBhalfOf: onBehalfLogin,
      delegatedUser: String(!!this.delegateInfo),
    };
  }

  private forbiddenMessage(html: string): string {
    if (html.includes('<table>')) return 'Table is not allowed here';
    if (html.includes('<img')) return 'Image is not allowed here';
    if (html.includes('<ul>') || html.includes('<ol>'))
      return 'Bullet points are not allowed here';
    return 'Underline / bold text is not allowed here';
  }

  private checkPreviousDataPresence(res: MergeResponse): void {
    this.isPreviouseDataPresent = !!res.prevCompletionYear; // ← update field
  }

  public clearLocalFilters(): void {
    const keys = [
      'sabFilterType',
      'sabFilterSequence',
      'sabFilterDepartment',
      'sabFilterStatus',
      'sabSentItemsFilterType',
      'sabSentItemsFilterSequence',
      'sabSentItemsFilterDepartment',
      'sabSentItemsFilterStatus',
      'sabSentItemsFilterDirectorate',
      'sabSentItemsFilterBehalf',
      'sabSentItemsFilterMultipleDept',
      'sabResponseProgressFilterType',
      'sabResponseProgressFilterSequence',
      'sabResponseProgressFilterDepartment',
      'sabResponseProgressFilterStatus',
      'sabResponseProgressFilterDirectorate',
      'sabResponseProgressFilterBehalf',
      'sabResponseProgressFilterMultipleDept',
    ];
    keys.forEach((k) => localStorage.removeItem(k));
  }

  /** toggle spinner with central LoadingService */
  private toggleLoading(url: string, on: boolean, err?: unknown): void {
    if (on) {
      this.isLoading.set(true);
      this.loader.setLoading(true, url);
    } else {
      this.isLoading.set(false);
      this.loader.setLoading(false, url);
      if (err) console.error(err);
    }
  }
}
