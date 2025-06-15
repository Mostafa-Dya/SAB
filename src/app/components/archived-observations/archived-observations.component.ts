import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';

import { SharedVariableService } from '../../services/shared-variable.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { ConfigService } from '../../services/config.service';
import { SharedModule } from '../../shared/modules/shared.module';

export interface Years {
  value: string;
}
export interface ObservationData {
  obsId: string;
  obsTitle: string;
  obsSequence: number;
  reportYear: string;
  obsType: string;
}

@Component({
  selector: 'app-archived-observations',
  standalone: true,
  templateUrl: './archived-observations.component.html',
  styleUrls: ['./archived-observations.component.scss'],
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivedObservationsComponent {
  /* ----------------------- static / view refs ----------------------- */
  @ViewChild(MatSort, { static: false }) private readonly sort?: MatSort;

  /* ------------------------- injected services ---------------------- */
  private readonly shared = inject(SharedVariableService);
  private readonly core = inject(CoreService);
  private readonly router = inject(Router);
  private readonly loading = inject(LoadingService);
  private readonly cfg = inject(ConfigService);

  /* -------------------------- reactive state ------------------------ */
  /** `true` when UI is RTL (signal comes straight from the service) */
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  /** table & selection helpers */
  readonly selection = new SelectionModel<ObservationData>(true);
  readonly dataSource = signal<MatTableDataSource<ObservationData> | null>(
    null
  );
  readonly displayedColumns = [
    'obsSequence',
    'obsTitle',
    'reportYear',
  ] as const;
  readonly displayedColumnsMob = ['obsTitle'] as const;

  /** filter form */
  readonly form = new FormGroup({
    obsTitle: new FormControl<string>('', { nonNullable: true }),
    obsSequence: new FormControl<string>('', { nonNullable: true }),
    selectedYear: new FormControl<string>('', { nonNullable: true }),
  });

  /** dropdown data */
  readonly years: Years[] = [];
  /* --------------------------------------------------------------- */

  /* ----- cached user context (delegation / admin / job-title) ----- */
  private userInfo: any = null;
  private delegateInfo: any = null;
  private userJobTitle = '';
  private isAdmin = false;
  private reportYear = '';
  private loginId = '';

  /* ------------------------------ ctor ------------------------------ */
  constructor() {
    this.restoreFilters();
    this.bootstrapUserContext();
  }

  /* ======================   lifecycle helpers   ===================== */

  /** initial load of years list; auto-search if filters pre-populated */
  private loadYears(): void {
    const url = 'uploadReportController/getMigratedReportYears';
    this.loading.setLoading(true, url);
    this.core
      .get<string[]>(url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (years) => {
          this.loading.setLoading(false, url);
          years.forEach((yr) => this.years.push({ value: yr }));
          this.years.reverse();

          // pick default / restored year
          if (!this.form.controls.selectedYear.value) {
            this.form.controls.selectedYear.setValue(
              this.years.at(0)?.value ?? ''
            );
          }

          // trigger auto-search if we restored filters
          this.getObsData();
        },
        error: (err) => {
          this.loading.setLoading(false, url);
          console.error(err);
        },
      });
  }

  /** read current KNPC or delegate user info and apply business rules */
  private bootstrapUserContext(): void {
    this.delegateInfo = JSON.parse(
      localStorage.getItem('sabDelegateUser') || 'null'
    );

    if (this.delegateInfo) {
      this.fetchDelegateInfo();
      return;
    }

    this.userInfo = JSON.parse(localStorage.getItem('sabUserInformation')!);
    this.applyUser(this.userInfo);
    this.loadYears();
  }

  /** remote GET for delegate user snapshot */
  private fetchDelegateInfo(): void {
    const url =
      `UserController/getDelegateUserInfo?userId=${this.delegateInfo.loginId}` +
      `&r=${Math.floor(Math.random() * 100) + 100}`;

    this.loading.setLoading(true, url);
    this.core
      .get(url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (info) => {
          this.loading.setLoading(false, url);
          this.applyUser(info);
          this.loadYears();
        },
        error: (err) => {
          this.loading.setLoading(false, url);
          console.error(err);
        },
      });
  }

  /** applies user snapshot to local state used later when building URLs */
  private applyUser(info: any): void {
    this.userInfo = info;
    this.userJobTitle = info.sabMember.userJobTitle;
    this.isAdmin = info.admin;
    this.reportYear = info.reportYear;
    this.loginId = info.sabMember.loginId;
  }

  /* ======================  data-layer actions  ====================== */

  /** main search click */
  getObsData(): void {
    const { obsTitle, obsSequence, selectedYear } = this.form.controls;

    /* persist current filters for F5/back-navigation comfort */
    localStorage.setItem('sabArchivedObsTitle', JSON.stringify(obsTitle.value));
    localStorage.setItem(
      'sabArchivedObsFilterYear',
      JSON.stringify(selectedYear.value)
    );
    localStorage.setItem(
      'sabArchivedObsFilterObsSequence',
      JSON.stringify(obsSequence.value)
    );

    this.selection.clear();
    const url = this.buildSearchUrl();
    this.loading.setLoading(true, url);

    this.core
      .get<Record<string, ObservationData>>(url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (payload) => {
          this.loading.setLoading(false, url);
          const rows = Object.values(payload);
          const table = new MatTableDataSource(rows);
          table.sort = this.sort ?? null;
          this.dataSource.set(table);
        },
        error: (err) => {
          this.loading.setLoading(false, url);
          console.error(err);
        },
      });
  }

  /** build the rather gnarly query-string the legacy API expects */
  private buildSearchUrl(): string {
    const base = 'launchObservations/archivedObservations';
    const { obsTitle, obsSequence, selectedYear } = this.form.controls;
    const params = new URLSearchParams({
      obsTitle: obsTitle.value,
      loginId: this.loginId,
      reportYear: selectedYear.value,
      obsSeq: obsSequence.value || '',
      isAdmin: String(this.isAdmin),
    });

    const pushCommon = (info: any, delegated: boolean) => {
      params.set('onBehalfOfUserTitle', info.userJobTitle);
      params.set('userDepartmentCode', info.departmentCode);
      params.set('userJobTitle', this.userJobTitle);
      params.set('isDelegatedUser', String(delegated));
      params.set('onBehalfOf', info.loginId);
    };

    if (this.delegateInfo) {
      pushCommon(this.userInfo.sabMember, true);
    } else if (this.userJobTitle === 'SEC') {
      pushCommon(this.userInfo.supervisorDetails, false);
    } else {
      pushCommon(this.userInfo.sabMember, false);
    }

    return `${base}?${params.toString()}`;
  }

  /** row click → details route */
  navigateTo(row: ObservationData): void {
    this.router.navigate([
      'archived-observations/observation-details',
      row.obsId,
    ]);
  }

  /** “Reset” button handler */
  reset(): void {
    this.form.reset({
      obsTitle: '',
      obsSequence: '',
      selectedYear: this.years.at(0)?.value ?? '',
    });
    this.dataSource.set(null);
  }

  /* ------------------------ helpers ------------------------ */

  /** restore filters from localStorage (called in ctor before UI load) */
  private restoreFilters(): void {
    this.form.patchValue({
      obsTitle: (
        JSON.parse(localStorage.getItem('sabArchivedObsTitle') || '""') ?? ''
      ).toString(),
      obsSequence: (
        JSON.parse(
          localStorage.getItem('sabArchivedObsFilterObsSequence') || '""'
        ) ?? ''
      ).toString(),
      selectedYear: JSON.parse(
        localStorage.getItem('sabArchivedObsFilterYear') || '""'
      ) as string,
    });
  }

  get mathOBS() {
    return Math.abs(+this.form.controls.obsSequence.value || 0).toString();
  }
}
