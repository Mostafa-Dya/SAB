/****************************************************************************************
 *  Classification-Change-Report  ·  Component logic (stand-alone, OnPush)
 ****************************************************************************************/
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, finalize } from 'rxjs';

import { ConfigService } from '../../services/config.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/modules/shared.module';

/* ────────────────────────────────────────────────────────────────────────── */
/* ■ Typed DTOs ­–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
export interface YearOption {
  value: string;
}
export interface DepartmentOption {
  id: string;
  name: string;
}

export interface ClassificationRow {
  obsSequence: number;
  obsTitle: string;
  reportYear: string;

  /* SA sections kept; other quarterly columns are optional */
  sa1Classification: string;
  sa1CompletionYear: string;
  sa1Entities: string;
  sa2Classification: string;
  sa2CompletionYear: string;
  sa2Entities: string;

  q1Classification?: string;
  q2Classification?: string;
  q3Classification?: string;
  q4Classification?: string;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ■ Component ­––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
@Component({
  selector: 'app-classification-change-report',
  templateUrl: './classification-change-report.component.html',
  styleUrls: ['./classification-change-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class ClassificationChangeReportComponent {
  /* ───────────── Dependencies */
  private readonly core = inject(CoreService);
  private readonly shared = inject(SharedVariableService);
  private readonly loader = inject(LoadingService);

  /* ───────────── Template refs */
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  /* ───────────── Reactive state */
  readonly isRtl$ = this.shared.isRtl$; // RTL as observable
  readonly years$ = new BehaviorSubject<YearOption[]>([]); // FY dropdown
  readonly departments$ = new BehaviorSubject<DepartmentOption[]>([ // Dept dropdown
    { id: '0', name: 'All' },
  ]);

  selectedYear = '';
  selectedDepartment = '0';
  obsSequence = '';
  observationTitle = '';

  /* data-table */
  dataSource = new MatTableDataSource<ClassificationRow>([]);
  readonly displayedColumns = [
    'obsSequence',
    'reportYear',
    'obsTitle',
    'sa1Classification',
    'sa1CompletionYear',
    'sa1Entities',
    'sa2Classification',
    'sa2CompletionYear',
    'sa2Entities',
  ];
  readonly displayedColumnsMob = ['obsTitle'];
  readonly displayedColumnsSmallMob = ['obsTitle'];

  /* UI helpers */
  innerWidth = window.innerWidth;
  isLoading = false;
  private readonly mainUrl = environment.baseUrl;

  /* ───────────── Lifecycle */
  constructor() {
    this.bootstrap();
  }

  /** initial data fetch */
  private bootstrap(): void {
    this.fetchYears();
    this.fetchDepartments();
  }

  /* ───────────── Remote calls – Years & Departments */
  private fetchYears(): void {
    const url = 'uploadReportController/getReportYears';
    this.loader.setLoading(true, url);
    this.core
      .get<string[]>(url)
      .pipe(finalize(() => this.loader.setLoading(false, url)))
      .subscribe({
        next: (list) => {
          const opts = list.map((v) => ({ value: v })).reverse();
          this.years$.next(opts);
          this.selectedYear = opts[0]?.value ?? '';
        },
        error: (err) => console.error('fetchYears', err),
      });
  }

  private fetchDepartments(): void {
    const url = 'UserController/getsabDepartments?directorateId=0';
    this.loader.setLoading(true, url);
    this.core
      .get<Record<string, string>>(url)
      .pipe(finalize(() => this.loader.setLoading(false, url)))
      .subscribe({
        next: (map) => {
          const opts = Object.entries(map)
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
          this.departments$.next([{ id: '0', name: 'All' }, ...opts]);
        },
        error: (err) => console.error('fetchDepartments', err),
      });
  }

  /* ───────────── Search */
  search(): void {
    this.isLoading = true;
    const url =
      'settingsController/getClassicationDetails' +
      `?reportYear=${this.selectedYear}` +
      `&departmentCode=${this.selectedDepartment}` +
      `&obsTitle=${encodeURIComponent(this.observationTitle ?? '')}` +
      `&obsSeq=${this.obsSequence ?? ''}`;

    this.loader.setLoading(true, url);
    this.core
      .get<ClassificationRow[]>(url)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loader.setLoading(false, url);
        })
      )
      .subscribe({
        next: (rows) => {
          this.dataSource = new MatTableDataSource(rows);
          if (this.paginator) this.dataSource.paginator = this.paginator;
        },
        error: (err) => console.error('search', err),
      });
  }

  /* ───────────── Export helpers */
  exportMSExcel(): void {
    const url =
      'ReminderAndClassificationExportController/exportClassificationDetailsToExcel' +
      `?reportYear=${this.selectedYear}` +
      `&departmentCode=${this.selectedDepartment}` +
      `&obsTitle=${encodeURIComponent(this.observationTitle ?? '')}` +
      `&obsSeq=${this.obsSequence ?? ''}`;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord(): void {
    const url =
      'ReminderAndClassificationExportController/exportClassificationDetailsToWord' +
      `?reportYear=${this.selectedYear}` +
      `&departmentCode=${this.selectedDepartment}` +
      `&obsTitle=${encodeURIComponent(this.observationTitle ?? '')}` +
      `&obsSeq=${this.obsSequence ?? ''}`;
    window.open(this.mainUrl + url, '_parent');
  }

  /* ───────────── Responsive helper */
  @HostListener('window:resize')
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }
}
