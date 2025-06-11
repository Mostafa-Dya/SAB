import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
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
  templateUrl: './search-reports.component.html',
  styleUrls: ['./search-reports.component.scss']
})
export class SearchReportsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['reportTitle', 'fiscalYear', 'reportType', 'action'];
  displayedColumnsMob: string[] = ['reportTitle'];
  selectedYear: string;
  selectedReport: string;
  isLoading: boolean = true;
  years: Years[] = [];
  reportType: ReportType[] = [
    // { value: 'Select Report Type', name: 'Select Report Type' },
    { value: 'SAB Initial Report', name: 'التقرير الأولى لديوان المحاسبة Initial Report' },
    // { value: 'SAB Final Report', name: 'التقرير  النهائي لديوان المحاسبة Final Rpt' },
    { value: 'SAB Commentary Report', name: "تقرير التبليغ SAB Commentary Report" },
    { value: 'KNPC Response Report', name: 'الرد على التقرير الأولى لديوان المحاسبة Initial Response Report' },
    { value: 'SAB Quarterly Report Q1', name: 'التقرير الربع سنوى الأول  Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'التقرير الربع سنوى الثاني Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'التقرير الربع سنوى الثالت Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'التقرير الربع سنوى الرابع Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'التقرير النصف سنوى الأول SA1' },
    { value: 'SAB Semi-annual Report 2', name: 'التقرير النصف سنوى الثاني SA2' },
    { value: 'KNPC Final Report', name: 'ا التقرير النهائي KNPC Final Report' },
    { value: 'Annual Report', name: 'التقرير السنوي' },
    { value: 'Seriousness of notes taken', name: 'جدية تسوية الملاحظات' }
  ];
  mainUrl: string;

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.selectedReport = this.reportType[0].value;
    this.getReportYear();
  }

  getReportYear() {
    this.isLoading = true;
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      this.selectedYear = this.years[0].value;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  reset() {
    this.selectedYear = this.years[0].value;
    this.selectedReport = this.reportType[0].value;
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data = [];
    }
  }

  searchReport() {
    this.isLoading = true;
    let url = 'ReportController/serachReports?reportYear=' + this.selectedYear + '&reportType=' + this.selectedReport;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      if (response.length > 0 && (response[0].obsType === 'Annual Report' || response[0].obsType === 'Seriousness of notes taken')) {
        for (var i = 0; i < response.length; i++) {
          if (response[i].obsType === 'Annual Report')
            response[i].obsType = 'التقرير السنوي';
          else response[i].obsType = 'جدية تسوية الملاحظات';
        }
      }
      if (response.length > 0 && (response[0].obsType === 'KNPC Final Report')) {
        for (var i = 0; i < response.length; i++) {
          if (response[i].obsType === 'KNPC Final Report') {
            response[i].obsType = 'KNPC Final Report';
            response[i].obsTitle = 'KNPC Final Report' + response[i].reportYear + '.doc';
          }
        }
      }
      this.dataSource = new MatTableDataSource(response);
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  downloadReport(report: any) {
    let url = 'DownloadController/downloadReportByDocId?docId=' + report.obsId;
    window.open(this.mainUrl + url, '_parent');
  }
}
