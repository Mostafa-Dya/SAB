import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';

import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { ConfigService } from '../../services/config.service';

import { UpdateDepartmentsComponent } from '../update-departments/update-departments.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ChangeDepartmentInfoDialogComponent } from '../change-department-info-dialog/change-department-info-dialog.component';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/modules/shared.module';

interface ObservationRow {
  position: number;
  obsSequence: number;
  obsTitle: string;
  directorate: string;
  departments: string;
  isActionDisabled: boolean;
  completed: boolean;
  changedDep: unknown;
  obsId: string;
}

@Component({
  selector: 'app-change-department',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './change-department.component.html',
  styleUrls: ['./change-department.component.scss'],
  imports: [SharedModule, MatProgressSpinnerModule],
})
export class ChangeDepartmentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /* ───────────── static view refs ───────────── */
  @ViewChild(MatSort, { static: true }) private readonly sort!: MatSort;

  /* ───────────── injected services ───────────── */
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly core = inject(CoreService);
  private readonly loading = inject(LoadingService);
  private readonly shared = inject(SharedVariableService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NzNotificationService);
  private readonly bp = inject(BreakpointObserver);

  /* ───────────── observables / signals ───────────── */
  readonly handset$ = this.bp
    .observe([Breakpoints.Handset, '(max-width: 991px)'])
    .pipe(
      map((state) => state.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  readonly isRtl = this.shared.isRtl$;

  /* ───────────── table & data state ───────────── */
  readonly displayedDesktop = ['seq', 'title', 'dir', 'dept', 'action', 'info'];
  readonly dataSource = new MatTableDataSource<ObservationRow>([]);
  isLoading = true;

  /* ───────────── misc component state ───────────── */
  reportId = '';
  mainUrl = environment.baseUrl;
  private userInfo!: any; // parsed from localStorage
  private rawBackendRows: any[] = []; // keep untouched

  /* ───────────── life-cycle ───────────── */
  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('reportId') ?? '';

    this.userInfo = JSON.parse(
      localStorage.getItem('sabUserInformation') ?? '{}'
    );

    this.fetchTableData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    /* destroy subscriptions */
  }

  /* ───────────── private helpers ───────────── */
  private fetchTableData(): void {
    this.isLoading = true;

    const url =
      `AssigmentsController/getObservationDepartments?` +
      `reportCycle=${this.userInfo.reportCycle}` +
      `&reportYear=${this.userInfo.reportYear}` +
      `&r=${Math.floor(Math.random() * 100) + 100}`;

    this.loading.setLoading(true, url);

    this.core
      .get<any[]>(url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (rows) => {
          this.loading.setLoading(false, url);
          this.isLoading = false;
          this.rawBackendRows = rows;
          this.dataSource.data = rows.map((row, idx) =>
            this.toTableRow(row, idx)
          );
        },
        error: () => {
          this.loading.setLoading(false, url);
          this.isLoading = false;
          this.notification.error('Error', 'Unable to load data');
        },
      });
  }

  private toTableRow(raw: any, idx: number): ObservationRow {
    const deps = raw.departments.map((d: any) => d.departmentName).join(', ');
    const dirs = [
      ...new Set(raw.departments.map((d: any) => d.directorateName)),
    ].join(', ');

    const departmentIsLocked = raw.departments.some((d: any) =>
      ['G&PA', 'CategoryGPA'].includes(d.departmentName)
    );

    return {
      position: idx,
      obsSequence: raw.obsSequence,
      obsTitle: raw.obsTitle,
      directorate: dirs,
      departments: deps,
      completed: raw.completed,
      changedDep: raw.changedDep,
      obsId: raw.obsId,
      isActionDisabled: departmentIsLocked || !raw.completed,
    };
  }

  /* ───────────── UI actions ───────────── */
  changeDepartmentInfo(row: ObservationRow): void {
    this.dialog.open(ChangeDepartmentInfoDialogComponent, {
      data: row.changedDep,
    });
  }

  updateDepartment(pos: number): void {
    const row = this.rawBackendRows[pos];

    const url =
      `UserController/getAllDepartments?userId=${this.userInfo.sabMember.loginId}` +
      `&obsId=${row.obsId}` +
      `&reportCycle=${this.userInfo.reportCycle}`;

    this.loading.setLoading(true, url);

    this.core
      .get(url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (directorates) => {
          this.loading.setLoading(false, url);

          const dlgRef = this.dialog.open(UpdateDepartmentsComponent, {
            data: {
              directoratesList: directorates,
              departments: row.departments,
            },
          });

          dlgRef.afterClosed().subscribe((res) => {
            if (res?.event === 'Send') {
              const payload = {
                obsId: row.obsId,
                reportYear: this.userInfo.reportYear,
                managers: res.data.selectedManagers,
                reportCycle: this.userInfo.reportCycle,
              };
              this.assignToDepartment(payload);
            }
          });
        },
        error: () => {
          this.loading.setLoading(false, url);
          this.notification.error('Error', 'Unable to load departments');
        },
      });
  }

  private assignToDepartment(body: unknown): void {
    const url = 'AssigmentsController/updateDepartmentBeforeLaunch';
    this.loading.setLoading(true, url);

    this.core
      .post(url, body)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.loading.setLoading(false, url);
          this.fetchTableData();
        },
        error: () => {
          this.loading.setLoading(false, url);
          this.notification.error('Error', 'Update failed');
        },
      });
  }

  launchReport(): void {
    const diagRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'COMPLETE_LAUNCHING',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT',
        reportCycle: this.reportId,
      },
    });

    diagRef.afterClosed().subscribe((yes) => {
      if (!yes) return;

      const fd = new FormData();
      fd.append('report', this.reportId);
      fd.append('typeValue', 'DirectLaunch');
      fd.append('reportYear', this.userInfo.reportYear);
      fd.append('extractType', '');

      const url = 'launchObservations/launchIntialReport';
      this.loading.setLoading(true, url);

      this.core
        .post(url, fd)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (res: any) => {
            this.loading.setLoading(false, url);

            if (res.type !== 'Failure') {
              this.router.navigate(['/inbox']);
            } else {
              this.notification.error('Error', res.message);
            }
          },
          error: () => {
            this.loading.setLoading(false, url);
            this.notification.error('Error', 'Launch failed');
          },
        });
    });
  }

  /* ───────────── export helpers ───────────── */
  exportMSExcel(): void {
    const url =
      `ReminderAndClassificationExportController/exportObservationDepartmentsToExcel` +
      `?reportCycle=${this.userInfo.reportCycle}` +
      `&reportYear=${this.userInfo.reportYear}`;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord(): void {
    const url =
      `ReminderAndClassificationExportController/exportObservationDepartmentsToWord` +
      `?reportCycle=${this.userInfo.reportCycle}` +
      `&reportYear=${this.userInfo.reportYear}`;
    window.open(this.mainUrl + url, '_parent');
  }
}
