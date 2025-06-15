import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ReportTypeService } from 'src/app/services/report-type.service';
import { ReportType } from 'src/app/models/report-type.model';
import { SharedModule } from '../../shared/modules/shared.module';

export interface Years {
  value: string;
}


export interface ReportData {
  obsId: string;
  obsTitle: string;
  obsType: string;
  reportYear: string;
  final: boolean;
}

@Component({
  selector: 'app-search-reports',
  standalone: true,
  templateUrl: './search-reports.component.html',
  styleUrls: ['./search-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SharedModule]
})
export class SearchReportsComponent implements OnInit {
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });
  dataSource = new MatTableDataSource<ReportData>();
  readonly displayedColumns: string[] = ['reportTitle', 'fiscalYear', 'reportType', 'action'];
  readonly displayedColumnsMob: string[] = ['reportTitle'];
  readonly yearControl = new FormControl('', { nonNullable: true });
  readonly reportControl = new FormControl('', { nonNullable: true });
  isLoading = true;
  years: Years[] = [];
  readonly reportType: ReadonlyArray<ReportType>;
  mainUrl = '';

  constructor(
    private coreService: CoreService,
    private shared: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    reportTypes: ReportTypeService
  ) {
    this.reportType = reportTypes.searchTypes;
  }

  ngOnInit(): void {
    this.mainUrl = this.configService.baseUrl;
    this.reportControl.setValue(this.reportType[0]?.value ?? '');
    this.getReportYear();
  }

  getReportYear(): void {
    this.isLoading = true;
    const url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        response.map((data: any) => {
          this.years.push({ value: data });
        });
        this.years.reverse();
        this.yearControl.setValue(this.years[0]?.value ?? '');
      },
      error: (error) => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :', error);
      },
    });
  }

  reset(): void {
    this.yearControl.setValue(this.years[0]?.value ?? '');
    this.reportControl.setValue(this.reportType[0]?.value ?? '');
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data = [];
    }
  }

  searchReport(): void {
    this.isLoading = true;
    const year = this.yearControl.value;
    const type = this.reportControl.value;
    const url = `ReportController/serachReports?reportYear=${year}&reportType=${type}`;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        if (
          response.length > 0 &&
          (response[0].obsType === 'Annual Report' ||
            response[0].obsType === 'Seriousness of notes taken')
        ) {
          for (const item of response) {
            item.obsType =
              item.obsType === 'Annual Report'
                ? 'التقرير السنوي'
                : 'جدية تسوية الملاحظات';
          }
        }
        if (response.length > 0 && response[0].obsType === 'KNPC Final Report') {
          for (const item of response) {
            if (item.obsType === 'KNPC Final Report') {
              item.obsType = 'KNPC Final Report';
              item.obsTitle = `KNPC Final Report${item.reportYear}.doc`;
            }
          }
        }
        this.dataSource = new MatTableDataSource(response);
      },
      error: (error) => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :', error);
      },
    });
  }

  downloadReport(report: ReportData): void {
    const url =
      'DownloadController/downloadReportByDocId?docId=' + report.obsId;
    window.open(this.mainUrl + url, '_parent');
  }
}
