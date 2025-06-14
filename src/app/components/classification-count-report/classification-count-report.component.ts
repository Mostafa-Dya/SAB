import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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

export interface Department {
  id: string;
  name: string;
}

export interface ReportData {
  count: string;
  type: string;
}

@Component({
  selector: 'app-classification-count-report',
  templateUrl: './classification-count-report.component.html',
  styleUrls: ['./classification-count-report.component.css']
})

export class ClassificationCountReportComponent implements OnInit {

  isRtl: any;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['count', 'type'];
  displayedColumnsMob: string[] = ['count'];
  selectedYear: string;
  selectedReport: string = 'All';
  selectedDepartment: string = '0';
  isLoading: boolean = false;
  mainUrl: string;
  countForm: FormGroup;
  fiscalYear = new FormControl();
  types = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  years: Years[] = [];
  reportType: ReportType[] = [
    // { value: 'KNPC Response Report', name: 'KNPC_RESPONSE_REPORT' },
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' }
  ];;
  departmentValue: Department[] = [
    { id: "0", name: "All" },
  ];

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.countForm = this.fb.group({
      fiscalYear: [null, [Validators.required]],
      types: [null, [Validators.required]],
    });
    this.mainUrl = this.configService.baseUrl;
    this.getYear();
    this.getDepartmentData();
    // this.search();
  }

  public errorHandling = (control: string, error: string) => {
    return this.countForm.controls[control].hasError(error);
  }

  getYear() {
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      setTimeout(() => {
        this.selectedYear = this.years[0].value;
        this.countForm.controls.fiscalYear.reset(this.years[0].value)
        this.selectedReport = this.reportType[0].value
        this.countForm.controls.types.reset(this.reportType[0].value);
      }, 1000)
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  getDepartmentData() {
    this.departmentValue = [
      { id: "0", name: "All" }
    ];
    let url = 'UserController/getsabDepartments?directorateId=0';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        this.departmentValue.push({ id: key, name: response[key] })
      })
      this.departmentValue.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  search() {
    if (this.countForm.status == "INVALID") {
      return;
    } else {
      this.isLoading = true;
      let url = 'settingsController/getClassicationCount?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&reportCycle=' + this.selectedReport;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        // let response = {"tyepACount":0,"tyepAName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepBCount":0,"tyepBDCount":0,"tyepBDName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepBName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepCCount":0,"tyepCDCount":0,"tyepCDName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepCName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepECount":0,"tyepEDCount":0,"tyepEDName":"تم الإنتهاء من إجرءاتها أو تلافيها","tyepEName":"تم الإنتهاء من إجرءاتها أو تلافيها"}
        let data: any = [];
        data.push({
          count: response.tyepACount,
          type: response.tyepAName
        }, {
          count: response.tyepBCount,
          type: response.tyepBName
        }, {
          count: response.tyepBDCount,
          type: response.tyepBDName
        }, {
          count: response.tyepCCount,
          type: response.tyepCName
        }, {
          count: response.tyepCDCount,
          type: response.tyepCDName
        }, {
          count: response.tyepECount,
          type: response.tyepEName
        }, {
          count: response.tyepEDCount,
          type: response.tyepEDName
        }, {
          count: response.tyepACount + response.tyepBCount + response.tyepBDCount + response.tyepCCount + response.tyepCDCount + response.tyepECount + response.tyepEDCount,
          type: "الاجمالي"
        })
        this.dataSource = new MatTableDataSource(data);
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
    }
  }

  exportMSExcel() {
    let url = 'ReminderAndClassificationExportController/exportClassificationCountToExcel?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&reportCycle=' + this.selectedReport;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord() {
    let url = 'ReminderAndClassificationExportController/exportClassificationCountToWord?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&reportCycle=' + this.selectedReport;
    window.open(this.mainUrl + url, '_parent');
  }
}