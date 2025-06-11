/* src/app/components/classification-count-report/classification-count-report.component.ts */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/modules/shared.module';

interface Years {
  value: string;
}
interface ReportType {
  value: string;
  name: string;
}
interface Department {
  id: string;
  name: string;
}
interface ReportData {
  count: number;
  type: string;
}

@Component({
  selector: 'app-classification-count-report',
  templateUrl: './classification-count-report.component.html',
  styleUrls: ['./classification-count-report.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class ClassificationCountReportComponent implements OnInit, OnDestroy {
  /* ─────────────── View & reactive-form ─────────────── */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  countForm!: FormGroup;

  /* ─────────────── UI helpers ─────────────── */
  dataSource?: MatTableDataSource<ReportData>;
  displayedColumns = ['count', 'type'];
  displayedColumnsMob = ['count'];
  years: Years[] = [];
  departmentValue: Department[] = [{ id: '0', name: 'All' }];
  reportType: ReportType[] = [
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' },
  ];

  /* ─────────────── State flags ─────────────── */
  isLoading = false;
  selectedDepartment = '0'; // bound with [(ngModel)]
  mainUrl = environment.baseUrl;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private core: CoreService,
    private loading: LoadingService,
    private shared: SharedVariableService
  ) {}

  /* ─────────────── Lifecycle ─────────────── */
  ngOnInit(): void {
    this.buildForm();
    this.populateYears();
    this.populateDepartments();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /* ─────────────── Form helpers ─────────────── */
  private buildForm(): void {
    this.countForm = this.fb.group({
      fiscalYear: [null, Validators.required],
      types: [null, Validators.required],
    });
  }

  errorHandling(control: string, error: string): boolean {
    return this.countForm.controls[control].hasError(error);
  }

  /* ─────────────── RTL helper ─────────────── */
  isRtl() {
    return this.shared.isRtl$;
  }
  get labelClass(): string {
    return this.isRtl() ? 'main-label-rtl' : 'main-label';
  }
  get isMobile(): boolean {
    return window.innerWidth <= 991;
  }

  /* ─────────────── Initial dropdown data ─────────────── */
  private populateYears(): void {
    const url = 'uploadReportController/getReportYears';
    this.loading.setLoading(true, url);

    const sub = this.core.get<string[]>(url).subscribe({
      next: (res) => {
        this.years = res.map((v) => ({ value: v })).reverse();
        this.countForm.patchValue({ fiscalYear: this.years[0]?.value });
      },
      error: (err) => console.error(err),
      complete: () => this.loading.setLoading(false, url),
    });
    this.subs.add(sub);
  }

  private populateDepartments(): void {
    const url = 'UserController/getsabDepartments?directorateId=0';
    this.loading.setLoading(true, url);

    const sub = this.core.get<Record<string, string>>(url).subscribe({
      next: (res) => {
        Object.entries(res).forEach(([id, name]) =>
          this.departmentValue.push({ id, name })
        );
        this.departmentValue.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => console.error(err),
      complete: () => this.loading.setLoading(false, url),
    });
    this.subs.add(sub);
  }

  /* ─────────────── Search & data mapping ─────────────── */
  search(): void {
    if (this.countForm.invalid) {
      return;
    }

    const { fiscalYear, types } = this.countForm.value;
    const url =
      `settingsController/getClassicationCount?reportYear=${fiscalYear}` +
      `&departmentCode=${this.selectedDepartment}&reportCycle=${types}`;

    this.isLoading = true;
    this.loading.setLoading(true, url);

    const sub = this.core.get(url).subscribe({
      next: (r: any) => {
        const data: ReportData[] = [
          { count: r.tyepACount, type: r.tyepAName },
          { count: r.tyepBCount, type: r.tyepBName },
          { count: r.tyepBDCount, type: r.tyepBDName },
          { count: r.tyepCCount, type: r.tyepCName },
          { count: r.tyepCDCount, type: r.tyepCDName },
          { count: r.tyepECount, type: r.tyepEName },
          { count: r.tyepEDCount, type: r.tyepEDName },
          {
            count:
              r.tyepACount +
              r.tyepBCount +
              r.tyepBDCount +
              r.tyepCCount +
              r.tyepCDCount +
              r.tyepECount +
              r.tyepEDCount,
            type: 'الاجمالي',
          },
        ];
        this.dataSource = new MatTableDataSource(data);
        setTimeout(() => {
          if (this.paginator && this.dataSource) {
            this.dataSource.paginator = this.paginator;
          }
        });
      },
      error: (err) => console.error(err),
      complete: () => {
        this.isLoading = false;
        this.loading.setLoading(false, url);
      },
    });

    this.subs.add(sub);
  }

  /* ─────────────── Export helpers ─────────────── */
  exportMSExcel(): void {
    const { fiscalYear, types } = this.countForm.value;
    const url =
      `ReminderAndClassificationExportController` +
      `/exportClassificationCountToExcel` +
      `?reportYear=${fiscalYear}&departmentCode=${this.selectedDepartment}` +
      `&reportCycle=${types}`;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord(): void {
    const { fiscalYear, types } = this.countForm.value;
    const url =
      `ReminderAndClassificationExportController` +
      `/exportClassificationCountToWord` +
      `?reportYear=${fiscalYear}&departmentCode=${this.selectedDepartment}` +
      `&reportCycle=${types}`;
    window.open(this.mainUrl + url, '_parent');
  }
}
