import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

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
export interface SABGPAUser {
  id: string;
  name: string;
}
export interface Directorate {
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
  selector: 'app-sendback-comments-report',
  templateUrl: './sendback-comments-report.component.html',
  styleUrls: ['./sendback-comments-report.component.css']
})

export class SendBackCommentsReportComponent implements OnInit {
  isRtl: any;
  countDataSource: MatTableDataSource<CountTable>;
  dataSource: MatTableDataSource<DateTable>;
  //displayedColumns: string[] = ['obsSequence', 'obsTitle', 'deptName', 'count'];
  displayedColumns: string[] = ['obsSequence', 'obsTitle', 'directorateName', 'departmentName', 'rejectedDate', 'sentFrom', 'rejectReason', 'comment'];
  displayedColumnsMob: string[] = ['obsTitle', 'rejectReason'];
  displayedColumnsMobDate: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsMob1: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsSmallMob: string[] = ['obsTitle'];
  selectedYear: string;
  selectedReport: string;
  selectedDepartment: string;
  selectedSentBy: string;
  selectedDirectorate: string;
  selectedDelegateUserInfo: any;
  isDirectorateVisible: boolean = true;
  isDepartmentVisible: boolean = true;
  directorateData = new FormControl();
  directorateList: string[] = ['All'];
  directorateAllValues: Directorate[] = [{ id: "All", name: "All" }];
  departmentAllValues: Department[] = [{ id: "All", name: "All" }];
  isDirectorateFirst: any = false;
  departmentData = new FormControl();
  departmentList: string[] = ['All'];
  isDepartmentFirst: any = false;
  isLoading: boolean = false;
  mainUrl: string;
  obsTitle: string;
  obsSequence: string;
  reminderForm: FormGroup;
  fisYear = new FormControl();
  reptypes = new FormControl();
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
 
  departmentValue: Department[] = [];
  directorateValue: Directorate[]=[];
  sabUserValue:SABGPAUser[]=[];
  
  innerWidth = 0;
  isFilterSelected: boolean;
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
     // dataResults: [null, [Validators.required]],
    });
    this.mainUrl = this.configService.baseUrl;
   // this.selectedResults = this.resultType[0].value;
    this.getDepartmentData();
    this.getDirectorateData();
    this. getSabMembers();
    this.getYear();
    this.innerWidth =  window.innerWidth;
  }

  public errorHandling = (control: string, error: string) => {
    return this.reminderForm.controls[control].hasError(error);
  }

 
  search() {

    if (this.reminderForm.status == "INVALID") {
      return;
    }
    else {

      let departmentData: string = '';
      let directorateData: string = '';
      let departmentDataName: string = '';
      let directorateDataName: string = '';
      for (let i = 0; i < this.departmentAllValues.length; i++) {
        if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
          for (let j = 0; j < this.departmentData.value.length; j++) {
            if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
              if (departmentData == '') {
                departmentData = this.departmentAllValues[i].id;
                departmentDataName =  this.departmentAllValues[i].name;
              } else {
                departmentData = departmentData + "," + this.departmentAllValues[i].id;
                departmentDataName = departmentDataName + "," + this.departmentAllValues[i].name;
              }
            }
          }
        }
      }
      for (let i = 0; i < this.directorateAllValues.length; i++) {
        if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
          for (let j = 0; j < this.directorateData.value.length; j++) {
            if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
              if (directorateData == '') {
                directorateData = this.directorateAllValues[i].id;
                directorateDataName = this.directorateAllValues[i].name;
              } else {
                directorateData = directorateData + "," + this.directorateAllValues[i].id;
                directorateDataName = directorateDataName + "," + this.directorateAllValues[i].name;
              }
            }
          }
        }
      }
      if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
        departmentData = 'All';
        departmentDataName = 'All';
         
      }
      if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
        directorateData = 'All';
        directorateDataName = 'All';
      }

      let directName=  encodeURIComponent(directorateDataName);
      let deptName=  encodeURIComponent(departmentDataName);
      this.isLoading = true;
      let url = `SearchController/getSendBackReasonsDetails?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
      url = `${url}&obsSeq=${this.obsSequence ? this.obsSequence : ''}&`;
      url = `${url}departmentName=${deptName ? deptName : ''}&`
      url = `${url}sentBy=${this.selectedSentBy ? this.selectedSentBy : ''}&`
      url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`
      url = `${url}directorateName=${directName}`;
      url =url+   '&dirId=' + directorateData + '&depId=' + departmentData;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
    //    this.searchSelectedResults = this.selectedResults;
    let dateresponse = response;
    // let dateresponse = [{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"103010","deptName":"Corporate Planning","sentDate":"09/03/2022 11:56:55","obsCategory":"Normal"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":1,"obsId":"2020-2021-1","obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 11:56:55","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:12:56","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:32:28","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:36:24","obsCategory":"Committee"},{"obsSequence":8,"obsId":"2020-2021-8","obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","deptCode":"0","deptName":"Committee","sentDate":"09/03/2022 09:41:44","obsCategory":"Committee"},{"obsSequence":9,"obsId":"2020-2021-9","obsTitle":" 3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","deptCode":"0","deptName":"Chief Executive Officer's Office","sentDate":"09/03/2022 09:42:57","obsCategory":"Special Nature"}];
    this.dataSource = new MatTableDataSource(dateresponse);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }) 
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
     // this.reminderForm.controls.dataResults.reset(this.resultType[0].value);
     // this.selectedReport = this.resultType[0].value;
      this.selectedYear = this.years[0].value;
      this.reminderForm.controls.reptypes.reset(this.reportType[0].value)
      this.selectedReport = this.reportType[0].value;
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  getDirectorateData() {
    let url = 'UserController/getsabDirectorates';
    this._loading.setLoading(true, url);
    this.directorateAllValues = [{ id: "All", name: "All" }];
    this.directorateList = ['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key: any) => {
        this.directorateAllValues.push({ id: key, name: response[key] })
        this.directorateList.push(response[key])
      })
      this.directorateAllValues.sort((a: any, b: any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      this.directorateList.sort();

      setTimeout(() => {
        // this.directorateData.setValue(this.directorateList);
        // console.log(this.directorateData, 'directorateData',this.directorateList, 'directorateList' )
        let filterDirectorate: any = localStorage.getItem('sabSBCRStatFilterDirectorate');
        if (filterDirectorate != null) {
          this.isFilterSelected = true;
          // this.directorateData.setValue(JSON.parse(filterDirectorate))
        } else {
          localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify([]));
        }
        this.isDirectorateFirst = false;
      }, 1000)
      //this.getDepartmentData();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getSabMembers() {
    this.sabUserValue = [
      { id: "All", name: "All" }
    ];
    let url = 'UserController/getGPASabMembers';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
     /**  Object.keys(response).forEach((key) => {

        this.sabUserValue.push({ id: key, name: response[key] })
      }) **/
        response.forEach((item: any) => {
          this.sabUserValue.push({ id: item.loginId, name: item.userName });
        });
      this.sabUserValue.sort((a, b) => {
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

  getDepartmentData() {
    let url = 'UserController/getsabDepartments';

    this._loading.setLoading(true, url);
    this.departmentAllValues = [{ id: "All", name: "All" }];
    this.departmentList = ['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        this.departmentAllValues.push({ id: key, name: response[key] })
        this.departmentList.push(response[key])
      })
      this.departmentAllValues.sort((a: any, b: any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      this.departmentList.sort();
      setTimeout(() => {
        // this.departmentData.setValue(this.departmentList);
        console.log(this.departmentData)
        let filterDepartment: any = localStorage.getItem('sabSBCRStatFilterDepartment');
        if (filterDepartment != null) {
          this.isFilterSelected = true;
          // this.departmentData.setValue(JSON.parse(filterDepartment))
        } else {
          localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify([]));
        }
        this.isDepartmentFirst = false;
      }, 1000)
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });

  }


  departmentChange(event: any) {

    if (!this.isDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isDepartmentFirst = true;
        if (event.source._selected) {
          this.departmentData.setValue(this.departmentList)
          localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify([]));
        } else {
          this.departmentData.setValue([]);
          localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabSBCRStatFilterDepartment');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isDepartmentFirst = true;

            if (this.departmentData.value[0] == 'All') {
              let data = [...this.departmentData.value];
              data.splice(0, 1);
              this.departmentData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify(['All', event.source.value]));
            }
            this.isDepartmentFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isDepartmentFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify(filter));
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabSBCRStatFilterDepartment', JSON.stringify([]));
                this.isDepartmentFirst = false;
              }
              this.isDepartmentFirst = false;
            }, 300)
          }

        }

      }

    }
  }

  directorateChange(event: any) {
    console.log(this.isDirectorateFirst)
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorateData.setValue(this.directorateList)
          localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify([]));
        } else {
          this.directorateData.setValue([]);
          localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabSBCRStatFilterDirectorate');
        if (!event.source._selected) {
          setTimeout(() => {
            this.isDirectorateFirst = true;
            if (this.directorateData.value[0] == 'All') {
              let data = [...this.directorateData.value];
              data.splice(0, 1);
              this.directorateData.setValue(data);
            }
            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify(['All', event.source.value]));
            }
            this.isDirectorateFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isDirectorateFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify(filter));
              if ((this.directorateData.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorateData.setValue(this.directorateList);
                localStorage.setItem('sabSBCRStatFilterDirectorate', JSON.stringify([]));
                this.isDirectorateFirst = false;
              }
              this.isDirectorateFirst = false;
            }, 300)
          }
          // this.isDirectorateFirst = false;
        }
      }
    }
  }

  exportMSExcel() {

    let departmentData: string = '';
    let directorateData: string = '';
    let departmentDataName: string = '';
    let directorateDataName: string = '';
    for (let i = 0; i < this.departmentAllValues.length; i++) {
      if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
        for (let j = 0; j < this.departmentData.value.length; j++) {
          if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
            if (departmentData == '') {
              departmentData = this.departmentAllValues[i].id;
              departmentDataName =  this.departmentAllValues[i].name;
            } else {
              departmentData = departmentData + "," + this.departmentAllValues[i].id;
              departmentDataName = departmentDataName + "," + this.departmentAllValues[i].name;
            }
          }
        }
      }
    }
    for (let i = 0; i < this.directorateAllValues.length; i++) {
      if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
        for (let j = 0; j < this.directorateData.value.length; j++) {
          if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
            if (directorateData == '') {
              directorateData = this.directorateAllValues[i].id;
              directorateDataName = this.directorateAllValues[i].name;
            } else {
              directorateData = directorateData + "," + this.directorateAllValues[i].id;
              directorateDataName = directorateDataName + "," + this.directorateAllValues[i].name;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All';
      departmentDataName = 'All';
       
    }
    if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
      directorateData = 'All';
      directorateDataName = 'All';
    }

    let directName=  encodeURIComponent(directorateDataName);
    let deptName=  encodeURIComponent(directorateData);
    let url = `ReminderAndClassificationExportController/exportSendBackCommentsReportToExcel?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
    url = `${url}&obsSeq=${this.obsSequence ? this.obsSequence : ''}&`;
    url = `${url}departmentName=${deptName ? deptName: ''}&`;
    url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`;
    url = `${url}directorateName=${directName}`;
    url = `${url}sentBy=${this.selectedSentBy ? this.selectedSentBy : ''}&`
    url =url+   '&dirId=' + directorateData + '&depId=' + departmentData;
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSWord() {

    let departmentData: string = '';
    let directorateData: string = '';
    let departmentDataName: string = '';
    let directorateDataName: string = '';
    for (let i = 0; i < this.departmentAllValues.length; i++) {
      if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
        for (let j = 0; j < this.departmentData.value.length; j++) {
          if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
            if (departmentData == '') {
              departmentData = this.departmentAllValues[i].id;
              departmentDataName =  this.departmentAllValues[i].name;
            } else {
              departmentData = departmentData + "," + this.departmentAllValues[i].id;
              departmentDataName = departmentDataName + "," + this.departmentAllValues[i].name;
            }
          }
        }
      }
    }
    for (let i = 0; i < this.directorateAllValues.length; i++) {
      if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
        for (let j = 0; j < this.directorateData.value.length; j++) {
          if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
            if (directorateData == '') {
              directorateData = this.directorateAllValues[i].id;
              directorateDataName = this.directorateAllValues[i].name;
            } else {
              directorateData = directorateData + "," + this.directorateAllValues[i].id;
              directorateDataName = directorateDataName + "," + this.directorateAllValues[i].name;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All';
      departmentDataName = 'All';
       
    }
    if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
      directorateData = 'All';
      directorateDataName = 'All';
    }

    let directName=  encodeURIComponent(directorateDataName);
    let deptName=  encodeURIComponent(departmentDataName);
    // http://localhost:9080/SABV2Services/Rest/SearchController/getReminderHistoryReport?reportYear=2020-2021&reportCycle=KNPC Response Report&obsId=&depId=&obsTitle=&results=
    let url = `ReminderAndClassificationExportController/exportSendBackCommentsReportToWord?reportYear=${this.selectedYear}&reportCycle=${this.selectedReport}`;
    url = `${url}&obsSeq=${this.obsSequence ? this.obsSequence : ''}&`;
    url = `${url}departmentName=${deptName ? deptName : ''}&`;
    url = `${url}obsTitle=${this.obsTitle ? this.obsTitle : ''}&`;
      url = `${url}sentBy=${this.selectedSentBy ? this.selectedSentBy : ''}&`
    url = `${url}directorateName=${directName}`;
    url =url+   '&dirId=' + directorateData + '&depId=' + departmentData;
    window.open(this.mainUrl + url, '_parent');
  }

}