import { Component, OnInit, ViewChild } from '@angular/core';
import { yearsPerPage } from '@angular/material/datepicker';
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

export interface Department {
  id: string;
  name: string;
}

export interface Data {
  // obsSequence: string;
  obsSequence: number;
  obsTitle: string;
  q1Classification: string;
  q2Classification: string;
  q3Classification: string;
  q4Classification: string;
  reportYear: string;
  sa1Classification: string;
  sa2Classification: string;
}

@Component({
  selector: 'app-classification-change-report',
  templateUrl: './classification-change-report.component.html',
  styleUrls: ['./classification-change-report.component.css']
})
export class ClassificationChangeReportComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['obsSequence', 'reportYear', 'obsTitle', 'q1Classification', 'sa1Classification', 'q2Classification', 'q3Classification', 'sa2Classification', 'q4Classification'];
   displayedColumns: string[] = ['obsSequence', 'reportYear', 'obsTitle', 'sa1Classification','sa1CompletionYear','sa1Entities',  'sa2Classification','sa2CompletionYear','sa2Entities'];

  displayedColumnsMob: string[] = ['obsTitle'];
  displayedColumnsSmallMob: string[] = ['obsTitle'];
  selectedYear: string = '';
  selectedDepartment: string = '0';
  isLoading: boolean = false;
  mainUrl: string;
  obsSequence: string;
  observationTitle: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  years: Years[] = [];
  departmentValue: Department[] = [
    { id: "0", name: "All" }
  ];
  innerWidth = 0;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private notification: NzNotificationService,
    private _loading: LoadingService) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.getYear();
    this.getDepartmentData();
    this.innerWidth =  window.innerWidth;
  }


  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
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
      this.selectedYear = this.years[0].value;
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

  search() {
    this.isLoading = true;
    let url = 'settingsController/getClassicationDetails?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&obsTitle=' + this.observationTitle + '&obsSeq=' + this.obsSequence;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      // response = [{"obsId":"2020-2021-1","obsSequence":1,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","q1Classification":"B","q2Classification":"BD","q3Classification":"A","q4Classification":"B","reportYear":"2020-2021","sa1Classification":"C","sa2Classification":"C"},{"obsId":"2020-2021-2","obsSequence":2,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","reportYear":"2020-2021"},{"obsId":"2020-2021-3","obsSequence":3,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","reportYear":"2020-2021"},{"obsId":"2020-2021-4","obsSequence":4,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","reportYear":"2020-2021"},{"obsId":"2020-2021-5","obsSequence":5,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","reportYear":"2020-2021"},{"obsId":"2020-2021-6","obsSequence":6,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","reportYear":"2020-2021"},{"obsId":"2020-2021-7","obsSequence":7,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","reportYear":"2020-2021"},{"obsId":"2020-2021-8","obsSequence":8,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","reportYear":"2020-2021"},{"obsId":"2020-2021-9","obsSequence":9,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","reportYear":"2020-2021"}];
      this.dataSource = new MatTableDataSource(response: any);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  exportMSExcel() {
    let url = 'ReminderAndClassificationExportController/exportClassificationDetailsToExcel?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&obsTitle=' + this.observationTitle + '&obsSeq=' + this.obsSequence;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord() {
    let url = 'ReminderAndClassificationExportController/exportClassificationDetailsToWord?reportYear=' + this.selectedYear + '&departmentCode=' + this.selectedDepartment + '&obsTitle=' + this.observationTitle + '&obsSeq=' + this.obsSequence;
    window.open(this.mainUrl + url, '_parent');
  }
}