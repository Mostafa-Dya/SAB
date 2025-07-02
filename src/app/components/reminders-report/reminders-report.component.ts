import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ReminderHistoryComponent } from '../reminder-history/reminder-history.component';

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
}

export interface Results {
  value: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface CountTable {
  // obsSequence: string;
  // obsTitle: string;
  // department: string;
  // totalReminder: string;
  "obsSequence": number,
  "obsId": string,
  "obsTitle": string,
  "deptCode": string,
  "deptName": string,
  "count": number
}

export interface DateTable {
  // obsSequence: string;
  // obsTitle: string;
  // department: string;
  // receivedDate: string;
  "obsSequence": number,
  "obsId": string,
  "obsTitle": string,
  "deptCode": string,
  "deptName": string,
  "sentDate": string,
  "obsCategory": string
}

@Component({
  selector: 'app-reminders-report',
  templateUrl: './reminders-report.component.html',
  styleUrls: ['./reminders-report.component.css']
})

export class RemindersReportComponent implements OnInit {
  isRtl: any;
  countDataSource: MatTableDataSource<CountTable>;
  dataSource: MatTableDataSource<DateTable>;
  displayedColumns: string[] = ['obsSequence', 'obsTitle', 'deptName', 'count'];
  displayedColumns1: string[] = ['obsSequence', 'obsTitle', 'deptName', 'sentDate'];
  displayedColumnsMob: string[] = ['obsTitle', 'count'];
  displayedColumnsMobDate: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsMob1: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsSmallMob: string[] = ['obsTitle'];
  selectedYear: string;
  selectedReport: string;
  selectedResults: string;
  searchSelectedResults: string;
  selectedDepartment: string;
  isLoading: boolean = false;
  mainUrl: string;
  obsTitle: string;
  obsSequence: string;
  reminderForm: FormGroup;
  fisYear = new FormControl();
  reptypes = new FormControl();
  dataResults = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  years: Years[] = [];
  reportType: ReportType[] = [
    // { value: 'Select Report Type', name: 'Select Report Type' },
    { value: 'KNPC Response Report', name: 'KNPC_RESPONSE_REPORT' },
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' }
  ];
  resultType: Results[] = [
    { value: 'count', name: 'Count' },
    { value: 'date', name: 'Dates' },
  ];
  departmentValue: Department[] = [];
  innerWidth = 0;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.reminderForm = this.fb.group({
      fisYear: [null, [Validators.required]],
      reptypes: [null, [Validators.required]],
      dataResults: [null, [Validators.required]],
    });
    this.mainUrl = this.configService.baseUrl;
    this.selectedResults = this.resultType[0].value;
    this.getDepartmentData();
    this.getYear();
    this.innerWidth =  window.innerWidth;
  }

  public errorHandling = (control: string, error: string) => {
    return this.reminderForm.controls[control].hasError(error);
  }

  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
  search() {
    if (this.reminderForm.status == "INVALID") {
      return;
    }
    else {
      this.isLoading = true;
      let url = `SearchController/getReminderHistoryReport?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
      url = `${url}&obsId=${this.obsSequence ? this.obsSequence : ''}&`;
      url = `${url}depId=${this.selectedDepartment ? this.selectedDepartment : ''}&`
      url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`
      url = `${url}results=${this.selectedResults}`
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        this.searchSelectedResults = this.selectedResults;
        if (this.selectedResults != 'date') {
          // let response = [{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","count":9},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","count":2},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","count":4},{"obsSequence":9,"obsId":"2020-2021-9","obsTitle":" 3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","deptCode":"0","deptName":"Chief Executive Officer's Office","count":1}];
          let countResponse = response;
          // let countResponse = [{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","count":9},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","count":2},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","count":4},{"obsSequence":9,"obsId":"2020-2021-9","obsTitle":" 3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","deptCode":"0","deptName":"Chief Executive Officer's Office","count":1}]
          this.countDataSource = new MatTableDataSource(countResponse);
          setTimeout(() => {
            this.countDataSource.paginator = this.paginator;
          });
        } else {
          // let response = [{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:12:56","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:32:28","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:36:24","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:41:44","obsCategory":"Committee"},{"obsSequence":9,"obsId":"2020-2021-9","obsTitle":" 3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","deptCode":"0","deptName":"Chief Executive Officer's Office","sentDate":"09/03/2022 09:42:57","obsCategory":"Special Nature"}];
          let dateresponse = response;
          // let dateresponse = [{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:12:56","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:32:28","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:36:24","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:41:44","obsCategory":"Committee"},{"obsSequence":9,"obsId":"2020-2021-9","obsTitle":" 3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","deptCode":"0","deptName":"Chief Executive Officer's Office","sentDate":"09/03/2022 09:42:57","obsCategory":"Special Nature"}];
          this.dataSource = new MatTableDataSource(dateresponse);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          })
        }
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
    }
  }

  getYear() {
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      let years: any[] = [];
      response.map((data: any) => {
        years.push({ value: data })
      })
      years.reverse();
      this.years = [...this.years, ...years];
      this.reminderForm.controls.fisYear.reset(this.years[0].value);
      this.reminderForm.controls.dataResults.reset(this.resultType[0].value);
      this.selectedReport = this.resultType[0].value;
      this.selectedYear = this.years[0].value;
      this.reminderForm.controls.reptypes.reset(this.reportType[0].value)
      this.selectedReport = this.reportType[0].value;
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
      Object.keys(response: any).forEach((key) => {
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

  exportMSExcel() {
    let url = `ReminderAndClassificationExportController/exportReminderHistoryReportToExcel?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
    url = `${url}&obsId=${this.obsSequence ? this.obsSequence : ''}&`;
    url = `${url}depId=${this.selectedDepartment ? this.selectedDepartment : ''}&`;
    url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`;
    url = `${url}results=${this.selectedResults}`;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord() {
    // http://localhost:9080/SABV2Services/Rest/SearchController/getReminderHistoryReport?reportYear=2020-2021&reportCycle=KNPC Response Report&obsId=&depId=&obsTitle=&results=
    let url = `ReminderAndClassificationExportController/exportReminderHistoryReportToWord?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
    url = `${url}&obsId=${this.obsSequence ? this.obsSequence : ''}&`;
    url = `${url}depId=${this.selectedDepartment ? this.selectedDepartment : ''}&`;
    url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`;
    url = `${url}results=${this.selectedResults}`;
    window.open(this.mainUrl + url, '_parent');
  }

  
  openReminderCountHistoryModel(observation: any) {

    let url= `SearchController/getReminderHistoryDetails?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`
      url = `${url}&obsId=${this.obsSequence ? this.obsSequence : ''}&`;
      url = `${url}depId=${this.selectedDepartment ? this.selectedDepartment : ''}&`
      url = `${url}uId=${observation.uId ? observation.uId : ''}&`
      url = `${url}workItemId=${observation.workItemId ? observation.workItemId : ''}&`
      url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`
      url = `${url}results=${this.selectedResults}&cycleId=${observation.cycleId}`
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(ReminderHistoryComponent, {
        width: '800px',
        data: response
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }
}