import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import * as _ from 'lodash';
import { J } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MatMenuTrigger } from '@angular/material/menu';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;

export interface PeriodicElement {
  obsTitle: string;
  obsSeq: number;
  receievedDate: string;
  reportName: string;
  deptName: string;
  responseStatus: string;
  stepCustomId: string;
  isSelected: boolean;
  stepUnqName: string;
  obsId: string;
  pendingUser: string;
}

@Component({
  selector: 'app-response-progress',
  templateUrl: './response-progress.component.html',
  styleUrls: ['./response-progress.component.scss']
})
export class ResponseProgressComponent implements OnInit {
  isRtl: any;
  isLoading: boolean = true;
  userId: string;
  userName: string;
  userJobTitle: string;
  departmentCode: string;
  typeList: string[] = ['All'];
  sequenceList: string[] = ['All'];
  departmentList: string[] = ['All'];
  statusList: string[] = ['All'];
  directorateList: string[] = ['All'];
  onBehalfList: string[] = ['All'];
  multipleList: string[] = ['All'];
  reviewedList: string[] = ['All'];
  reminderCountList: string[] = ['All']
  typeData = new FormControl();
  sequenceData = new FormControl();
  departmentData = new FormControl();
  statusData = new FormControl();
  directorateData = new FormControl();
  onBehalfData = new FormControl();
  multipleData = new FormControl();
  reviewedData = new FormControl();
  reminderCountData = new FormControl();
  isTypeFirst: any = true;
  isSequenceFirst: any = true;
  isDepartmentFirst: any = true;
  isStatusFirst: any = true;
  isDirectorateFirst: any = true;
  isOnBehalfFirst: any = true;
  isMultipleFirst: any = true;
  isReviewedFirst: any = true;
  isReminderCountFirst: any = true;
  inboxItems: any;
  dataSource: MatTableDataSource<PeriodicElement>;
  selectedRow: PeriodicElement[] = [];
  selection = new SelectionModel<any>(true, []);
  isSendReminder = false;
  isEditResponse = false;
  isReviewEnabled= false;
  isReviewButtonEnabled= false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['type', 'obsSeq', 'obsTitle', 'sentDate', 'reportName', 'deptName', 'responseStatus', 'directorateName', 'respondOnBehalf', 'sentToMultipleDept', 'pendingUser'];
  displayedColumnsMob: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsSmallMob: string[] = ['obsTitle'];
  isAdmin: boolean = false;
  isSendReminderEnabled: boolean = false;
  userInformation: any;
  pageIndex: string | null;
  selectedDelegateUserInfo: any;
  responseProgressInterval: any;
  mainUrl: any;
  reportYear: any;
  isCalled = false;
  reportCycle: any;
  innerWidth = 0;
  constructor(
    private coreService: CoreService,
    private router: Router,
    public dialog: MatDialog,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private configService: ConfigService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageIndex = localStorage.getItem('sabPaginatorResponseProgressIndex');
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabDelegateUser');
    if (data) {
      this.selectedDelegateUserInfo = JSON.parse(data);
    }
    this.sharedVariableService.getDelegateUserValue().subscribe((value) => {
      if (value) {

        this.isCalled = false;
        let data: any = localStorage.getItem('sabDelegateUser');
        if (data) {
          this.selectedDelegateUserInfo = JSON.parse(data);
        } else {
          this.selectedDelegateUserInfo = data;
        }

        let userData: any = localStorage.getItem('sabUserInformation');
        this.userInformation = JSON.parse(userData);
        console.log(this.userInformation)
        this.userId = this.userInformation.sabMember.loginId;
        this.userJobTitle = this.userInformation.sabMember.userJobTitle;
        this.departmentCode = localStorage.getItem('departmentCode') || '';
        this.isAdmin = this.userInformation.admin;
        
        if (!this.isCalled) {
          this.getResponseProgressData();
          this.isCalled = true;
        }


      }
    });
    // this.userId = localStorage.getItem('loginId') || '';
    // this.userJobTitle = localStorage.getItem('userJobTitle') || '';
    // this.departmentCode = localStorage.getItem('departmentCode') || '';
    let userData: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(userData);

    this.userId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.departmentCode = localStorage.getItem('departmentCode') || '';

    this.isAdmin = this.userInformation.admin;
    this.reportYear = this.userInformation.reportYear;
    this.reportCycle = this.userInformation.reportCycle;
    this.mainUrl = this.configService.baseUrl;
     // code of enabling reminder
     if(this.isAdmin){
      this.isSendReminderEnabled = true;
     }
    else if(this.selectedDelegateUserInfo && 
      (this.selectedDelegateUserInfo.userJobTitle =='MGR' || this.selectedDelegateUserInfo.userJobTitle =='TL')){
        this.isSendReminderEnabled = true;
    }else if(this.userJobTitle == 'SEC' &&
     (this.userInformation.supervisorDetails.userJobTitle =='MGR' ||
     this.userInformation.supervisorDetails.userJobTitle =='TL')){
      this.isSendReminderEnabled = true;
    }else if(this.isAdmin ||  this.userJobTitle=='MGR' || this.userJobTitle=='TL'){
      this.isSendReminderEnabled = true;
    }else{
      this.isSendReminderEnabled = false;
    }
    //--
    if (this.isSendReminderEnabled) {
     // if(this.isAdmin){
      this.displayedColumns.splice(0, 0, 'select');
    //  }
      this.displayedColumns.push('reminderCount')
      // this.displayedColumns.splice(this.displayedColumns.length - 1, 0, 'remainingCount');
    }

    if (this.userInformation.canReviewObservations && this.reportCycle != 'SAB Commentary Report') {
      this.isReviewEnabled= true;
      this.displayedColumns.push('reviewed')
    }
  //  this.getUserInfo();
    this.getResponseProgressData();
    this.responseProgressInterval = setInterval(() => this.checkResponseProgressData(), 60000);
    this.innerWidth =  window.innerWidth;
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
  ngOnDestroy() {
    clearInterval(this.responseProgressInterval);
  }

  getResponseProgressData() {
    this.typeData = new FormControl();
    this.typeList = ['All'];
    this.isTypeFirst = true;
    this.sequenceData = new FormControl();
    this.sequenceList = ['All'];
    this.isSequenceFirst = true;
    this.departmentData = new FormControl();
    this.departmentList = ['All'];
    this.isDepartmentFirst = true;
    this.statusData = new FormControl();
    this.statusList = ['All'];
    this.isStatusFirst = true;
    this.directorateData = new FormControl();
    this.directorateList = ['All'];
    this.isDirectorateFirst = true;
    this.onBehalfData = new FormControl();
    this.onBehalfList = ['All'];
    this.isOnBehalfFirst = true;
    this.multipleData = new FormControl();
    this.reviewedData = new FormControl();
    this.reminderCountData = new FormControl();
    this.multipleList = ['All'];
    this.reviewedList = ['All'];
    this.reminderCountList = ['All']
    this.isMultipleFirst = true;
    this.isReviewedFirst = true;
    this.isReminderCountFirst = true;
    let url = 'InProgController/InProgWorkItems?isAdmin=' + this.isAdmin + '&userLogin=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId+ '&behalfUserTitle=' + this.selectedDelegateUserInfo.userJobTitle+ '&behalfUserDeptCode=' + this.selectedDelegateUserInfo.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle  +'&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&behalfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle+ '&behalfUserDeptCode=' + this.userInformation.supervisorDetails.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode +'&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
      // response = [{"obsId":"2020-2021-2","obsSeq":2,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"088aa713-3a0e-4830-82a6-10d04b6b5a5b","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2020-2021-3","obsSeq":3,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"cac4bb61-7278-4792-a67b-c6a68a6a9b16","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-4","obsSeq":4,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"71e9be4f-1c53-4966-8e2a-2305c8cc5276","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-5","obsSeq":5,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"f3048e69-e621-4bf4-805f-fb02f492a7bc","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-6","obsSeq":6,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"61279240-a739-465e-87d2-33762919ea71","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-7","obsSeq":7,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"61063a9e-515e-4400-a223-2ffc1e673b4a","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-8","obsSeq":8,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"364d40a9-a878-401a-b7dd-2af426cb5459","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-9","obsSeq":9,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"23c60531-3494-43b0-87a0-24c5ac716b4b","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-10","obsSeq":10,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"1522b729-b898-4b52-acea-55caf841298a","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-11","obsSeq":11,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"03c77f98-f25a-4317-a177-dad0ba196a8d","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-12","obsSeq":12,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"1a1dd34e-83dd-450b-9898-dabac22c0e10","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"}]
      

      this.isLoading = false;
      this._loading.setLoading(false, url);
      let isNADepartmentAvailable = false;
      let isNADirectorateAvailable = false;
      let filterType = localStorage.getItem('sabResponseProgressFilterType');
      let filterSequence = localStorage.getItem('sabResponseProgressFilterSequence');
      let filterDepartment = localStorage.getItem('sabResponseProgressFilterDepartment');
      let filterStatus = localStorage.getItem('sabResponseProgressFilterStatus');
      let filterDirectorate = localStorage.getItem('sabResponseProgressFilterDirectorate');
      let filterBehalf = localStorage.getItem('sabResponseProgressFilterBehalf');
      let filterMultipleDept = localStorage.getItem('sabResponseProgressFilterMultipleDept');
      let filterReminderCount = localStorage.getItem('sabResponseProgressFilterReminderCount');
      let filterReviewed = localStorage.getItem('sabResponseProgressFilterReviewed');
      let isFilterSelected = false;
      let reminderCountList:any = [];
      this.sharedVariableService.setResponseInProgValue(response.length);
      response.map((data: any, i: any) => {
        let sendDate = response[i].sentDate.replaceAll('/', '-');
        let time = sendDate.split(' ')
        sendDate  = time[0].split('-')
        let onlyDate = sendDate[0]
        sendDate[0] = sendDate[2]
        sendDate[2] = onlyDate
        sendDate = sendDate.join('-')
        sendDate = sendDate + ' ' + time[1]
        sendDate = new Date(sendDate)
      
      response[i].sentDate = sendDate
        data.reminderCount = data.reminderCount || 0;
        data.stepCustomId = data.stepUnqName != 'GPA-Pending-Extraction' ? data.stepCustomId  : data.obsId;
        this.typeList.push(data.responseType);
        this.sequenceList.push(data.obsSeq);
        if (data.deptName == "N/A") {
          isNADepartmentAvailable = true;
        } else {
          const department = data.deptName.split(";");
          department.map((dep: any) => {
            if(dep.trim() != ''){
              this.departmentList.push(dep.trim());
            }
          });
        }
        if (data.directorateName == "N/A") {
          isNADirectorateAvailable = true;
        } else {
          const directorate = data.directorateName.split(";");
          directorate.map((direc: any) => {
            if(direc.trim()){
              this.directorateList.push(direc.trim());
            }            
          });
        }
        this.statusList.push(data.responseStatus);
        this.onBehalfList.push(data.respondOnBehalf);
        this.multipleList.push(data.sentToMultipleDept);
        this.reviewedList.push(data.reviewed)
        reminderCountList.push(data.reminderCount)

      

        // data.isExpanded = true;
      })
      let typeSet = new Set(this.typeList);
      this.typeList = [...typeSet];
      if (filterType != null) {
        isFilterSelected = true;
        // this.typeData.setValue(JSON.parse(filterType));
        let filterValue = await this.applyOldFilter(filterType, this.typeList, [])
        this.typeData.setValue(filterValue);
      } else {
        this.typeData.setValue(this.typeList);
      }
      // this.typeData.setValue(this.typeList);
      let sequenceSet = new Set(this.sequenceList);
      this.sequenceList = [...sequenceSet];
      if (filterSequence != null) {
        isFilterSelected = true;
        // this.sequenceData.setValue(JSON.parse(filterSequence));
        let filterValue = await this.applyOldFilter(filterSequence, this.sequenceList, [])
        this.sequenceData.setValue(filterValue);
      } else {
        this.sequenceData.setValue(this.sequenceList);
      }
      // this.sequenceData.setValue(this.sequenceList);
      let departmentSet = new Set(this.departmentList);
      this.departmentList = [...departmentSet];
      this.departmentList.sort();
      if (isNADepartmentAvailable) {
        this.departmentList.push('N/A');
      }
      if (filterDepartment != null) {
        isFilterSelected = true;
        // this.departmentData.setValue(JSON.parse(filterDepartment));
        let filterValue = await this.applyOldFilter(filterDepartment, this.departmentList, [])
        this.departmentData.setValue(filterValue);
      } else {
        this.departmentData.setValue(this.departmentList);
      }
      // this.departmentData.setValue(this.departmentList);
      let statusSet = new Set(this.statusList);
      this.statusList = [...statusSet];
      this.statusList.sort();
      if (filterStatus != null) {
        isFilterSelected = true;
        // this.statusData.setValue(JSON.parse(filterStatus));
        let filterValue = await this.applyOldFilter(filterStatus, this.statusList, [])
        this.statusData.setValue(filterValue);
      } else {
        this.statusData.setValue(this.statusList);
      }
      // this.statusData.setValue(this.statusList);
      let directorateSet = new Set(this.directorateList);
      this.directorateList = [...directorateSet];
      this.directorateList.sort();
      if (isNADirectorateAvailable) {
        this.directorateList.push('N/A');
      }
      if (filterDirectorate != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterDirectorate, this.directorateList, [])
        this.directorateData.setValue(filterValue);
        // this.directorateData.setValue(JSON.parse(filterDirectorate));
      } else {
        this.directorateData.setValue(this.directorateList);
      }
      // this.directorateData.setValue(this.directorateList);
      let onBehalfSet = new Set(this.onBehalfList);
      this.onBehalfList = [...onBehalfSet];
      if (filterBehalf != null) {
        isFilterSelected = true;
        // this.onBehalfData.setValue(JSON.parse(filterBehalf));
        let filterValue = await this.applyOldFilter(filterBehalf, this.onBehalfList, [])
        this.onBehalfData.setValue(filterValue);
      } else {
        this.onBehalfData.setValue(this.onBehalfList);
      }
      // this.onBehalfData.setValue(this.onBehalfList);
      let multipleSet = new Set(this.multipleList);
      this.multipleList = [...multipleSet];
      if (filterMultipleDept != null) {
        isFilterSelected = true;
        // this.multipleData.setValue(JSON.parse(filterMultipleDept));
        let filterValue = await this.applyOldFilter(filterMultipleDept, this.multipleList, [])
        this.multipleData.setValue(filterValue);
      } else {
        this.multipleData.setValue(this.multipleList);
      }


      let reviewedSet = new Set(this.reviewedList);
      this.reviewedList = [...reviewedSet];
      if (filterReviewed != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterReviewed, this.reviewedList, [])
        this.reviewedData.setValue(filterValue);
      } else {
        this.reviewedData.setValue(this.reviewedList);
      }

      let reminderCountSet = new Set(reminderCountList);
      reminderCountList = [...reminderCountSet];
      reminderCountList.sort();
      this.reminderCountList = [...this.reminderCountList, ...reminderCountList ]
      if (filterReminderCount != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterReminderCount, this.reminderCountList, [])
        this.reminderCountData.setValue(filterValue);
      } else {
        this.reminderCountData.setValue(this.reminderCountList);
      }

      this.inboxItems = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.data.sort((a, b) => {
        return a.obsSeq - b.obsSeq;
      });
      if (isFilterSelected) {
        this.updateDataSource();
      }
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
      setTimeout(() => {
        this.isTypeFirst = false;
        this.isSequenceFirst = false;
        this.isDepartmentFirst = false;
        this.isStatusFirst = false;
        this.isDirectorateFirst = false;
        this.isOnBehalfFirst = false;
        this.isMultipleFirst = false;
        this.isReviewedFirst = false;
        this.isReminderCountFirst = false
        // this.setAnchorTagSize();
      }, 500)
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  // setAnchorTagSize(){
  //   console.log("inside setAnchor")
  //   let elementTD = document.getElementsByClassName('mat-row');
  //   console.log(elementTD)
  //    for(let i = 0;i < elementTD.length;i++){
  //        $('.anchor-tag-'+i).css('height',elementTD[i].clientHeight+'px')
  //    }
    
  // }


  applyOldFilter(filterType: any, list: any, oldList: any) {
    let filterValue: any = [];
    filterType = JSON.parse(filterType)
    for (let i = 0; i < list.length; i++) {
      let index = filterType.indexOf(list[i]);
      if (index == -1) {
        filterValue.push(list[i])
      }
    }  
    return filterValue
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    let selected = []
    this.selectedRow = [];
    if (this.isAllSelected()) {
      this.selection.clear(); this.selectedRow = [];
      this.isSendReminder = false;
      this.isEditResponse = false;
      this.dataSource.data.forEach((row, i) => {
        this.dataSource.data[i].isSelected = false;
      });
    } else {

      this.dataSource.data.forEach((row: any, i) => {

        if(row?.reviewed == "yes"){
          this.isReviewButtonEnabled = false;
        }
          
          this.dataSource.data[i].isSelected = this.dataSource.data[i].hasOwnProperty('isSelected') ? !this.dataSource.data[i].isSelected : true;
        
          // this.dataSource.data[i].isSelected = true;
          let stepCustomId =  row.stepUnqName != 'GPA-Pending-Extraction' ? row.stepCustomId  : row.obsId;
          this.selection.select(stepCustomId);

          this.selectedRow.push(this.dataSource.data[i])
          let find = false;
          let isEditStepFind = false;
          this.isSendReminder = false;
          this.isEditResponse = false;
          this.selectedRow.map(data => {

            if (data.stepUnqName == 'G&PAApprove' || data.stepUnqName == 'G&PAReview' || data.stepUnqName == "MGR-PENDING-COMBINING" || 
            data.stepUnqName == "G&PACOombineResponse" ||    data.stepUnqName == "SN-CEO-APPROVAL-COMBINE" || data.stepUnqName == "GPA-ASSIGN" ||
              data.stepUnqName == "G&PA Park" || data.stepUnqName == "G&PAApprove-EditResponse" || data.stepUnqName == 'GPA-Pending-Extraction') {
              find = true;
              this.isSendReminder = false;
            }
            else {
              this.isSendReminder = false;
            }
            if (!find) {
              this.isSendReminder = true;
            }

          if (data.stepUnqName != "G&PA Park") {
            isEditStepFind = true;
            this.isEditResponse = false;
          }
          else {
            this.isEditResponse = false;
          }
          if (!isEditStepFind) {
            this.isEditResponse = true;
          }
        })
        if (!find) {
          this.isSendReminder = true;
        }
        if (!isEditStepFind) {
          this.isEditResponse = true;
        }
      }
      );

    }
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.obsSeq + 1}`;
  }

  navigateTo(row: any,event:MouseEvent) {
    // if(event.ctrlKey){

    // }else{
      let responseItems = []
      let selectedIndex = 0;
      let matched = false
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].stepCustomId == row.stepCustomId) {
          matched = true;
        }
      //  if(this.dataSource.data[i].responseStatus !='Pending Combine Response Update'){
          if(matched == false){
            selectedIndex =  selectedIndex + 1;
          }
          responseItems.push({
            obsId: this.dataSource.data[i].obsId,
            stepUnqName: this.dataSource.data[i].stepUnqName,
            stepCustomId: this.dataSource.data[i].stepCustomId,
            pendingUser: this.dataSource.data[i].pendingUser,
            responseStatus:this.dataSource.data[i].responseStatus,
          })
       // }
  
        if (this.dataSource.data.length - 1 == i) {
          localStorage.setItem('responseItems', JSON.stringify(responseItems))
          localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex))
        }
      }
      console.log(row,"row??");
      
      if (this.isAdmin && event?.ctrlKey) {
          let serverHost = location.href.split('/#/')
          const link = document.createElement("a");        
          link.href = `${serverHost[0]}/#/response-progress/work-item-details/${row.stepCustomId}?obsId=${row.obsId}&stepUnqName=${row.stepUnqName}&pendingUser=${row?.pendingUser}`;
          link.target = "_blank";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
        this.router.navigate(['response-progress/work-item-details', row.stepCustomId], { queryParams: { obsId: row.obsId, stepUnqName: row.stepUnqName, pendingUser: row.pendingUser, selectedIndex: selectedIndex} });
      }
  }

  typeChange(event: any) {
    if (!this.isTypeFirst) {
      if (event.source.value == 'All') {
        this.isTypeFirst = true;
        if (event.source._selected) {
          this.typeData.setValue(this.typeList);
          localStorage.setItem('sabResponseProgressFilterType', JSON.stringify([]));
        } else {
          this.typeData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterType', JSON.stringify(this.typeList));
        }
        this.isTypeFirst = false;
      } else {
        this.isTypeFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterType');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isTypeFirst = true;

            if (this.typeData.value[0] == 'All') {
              let data = [...this.typeData.value];
              data.splice(0, 1);
              this.typeData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterType', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterType', JSON.stringify(['All', event.source.value]));
            }
            this.isTypeFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isTypeFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterType', JSON.stringify(filter));
              if ((this.typeData.value.length + 1) == this.typeList.length) {
                this.isTypeFirst = true;
                this.typeData.setValue(this.typeList);
                localStorage.setItem('sabResponseProgressFilterType', JSON.stringify([]));
                this.isTypeFirst = false;
              }
              this.isTypeFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  sequenceChange(event: any) {
    if (!this.isSequenceFirst) {
      if (event.source.value == 'All') {
        this.isSequenceFirst = true;
        if (event.source._selected) {
          this.sequenceData.setValue(this.sequenceList);
          localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify([]));
        } else {
          this.sequenceData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify(this.sequenceList));
        }
        this.isSequenceFirst = false;
      } else {
        this.isSequenceFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterSequence');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isSequenceFirst = true;

            if (this.sequenceData.value[0] == 'All') {
              let data = [...this.sequenceData.value];
              data.splice(0, 1);
              this.sequenceData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify(['All', event.source.value]));
            }
            this.isSequenceFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isSequenceFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify(filter));
              if ((this.sequenceData.value.length + 1) == this.sequenceList.length) {
                this.isSequenceFirst = true;
                this.sequenceData.setValue(this.sequenceList);
                localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify([]));
                this.isSequenceFirst = false;
              }
              this.isSequenceFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  departmentChange(event: any) {
    if (!this.isDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isDepartmentFirst = true;
        if (event.source._selected) {
          this.departmentData.setValue(this.departmentList);
          localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify([]));
        } else {
          this.departmentData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterDepartment');

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
              localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify(filter));
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify([]));
                this.isDepartmentFirst = false;
              }
              this.isDepartmentFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  statusChange(event: any) {
    if (!this.isStatusFirst) {
      if (event.source.value == 'All') {
        this.isStatusFirst = true;
        if (event.source._selected) {
          this.statusData.setValue(this.statusList);
          localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify([]));
        } else {
          this.statusData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify(this.statusList));
        }
        this.isStatusFirst = false;
      } else {
        this.isStatusFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterStatus');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isStatusFirst = true;

            if (this.statusData.value[0] == 'All') {
              let data = [...this.statusData.value];
              data.splice(0, 1);
              this.statusData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify(['All', event.source.value]));
            }
            this.isStatusFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isStatusFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify(filter));
              if ((this.statusData.value.length + 1) == this.statusList.length) {
                this.isStatusFirst = true;
                this.statusData.setValue(this.statusList);
                localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify([]));
                this.isStatusFirst = false;
              }
              this.isStatusFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  directorateChange(event: any) {
    console.log(event)
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorateData.setValue(this.directorateList);
          localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify([]));
        } else {
          this.directorateData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterDirectorate');
        console.log(event)
        console.log(filter)
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
              localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify(filter));
              if ((this.directorateData.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorateData.setValue(this.directorateList);
                localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify([]));
                this.isDirectorateFirst = false;
              }
              this.isDirectorateFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  onBehalfChange(event: any) {
    if (!this.isOnBehalfFirst) {
      if (event.source.value == 'All') {
        this.isOnBehalfFirst = true;
        if (event.source._selected) {
          this.onBehalfData.setValue(this.onBehalfList);
          localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify([]));
        } else {
          this.onBehalfData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify(this.onBehalfList));
        }
        this.isOnBehalfFirst = false;
      } else {
        this.isOnBehalfFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterBehalf');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isOnBehalfFirst = true;

            if (this.onBehalfData.value[0] == 'All') {
              let data = [...this.onBehalfData.value];
              data.splice(0, 1);
              this.onBehalfData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify(['All', event.source.value]));
            }
            this.isOnBehalfFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isOnBehalfFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify(filter));
              if ((this.onBehalfData.value.length + 1) == this.onBehalfList.length) {
                this.isOnBehalfFirst = true;
                this.onBehalfData.setValue(this.onBehalfList);
                localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify([]));
                this.isOnBehalfFirst = false;
              }
              this.isOnBehalfFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  multipleChange(event: any) {
    if (!this.isMultipleFirst) {
      if (event.source.value == 'All') {
        this.isMultipleFirst = true;
        if (event.source._selected) {
          this.multipleData.setValue(this.multipleList);
          localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify([]));
        } else {
          this.multipleData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify(this.multipleList));
        }
        this.isMultipleFirst = false;
      } else {
        this.isMultipleFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterMultipleDept');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isMultipleFirst = true;

            if (this.multipleData.value[0] == 'All') {
              let data = [...this.multipleData.value];
              data.splice(0, 1);
              this.multipleData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify(['All', event.source.value]));
            }
            this.isMultipleFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isMultipleFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify(filter));
              if ((this.multipleData.value.length + 1) == this.multipleList.length) {
                this.isMultipleFirst = true;
                this.multipleData.setValue(this.multipleList);
                localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify([]));
                this.isMultipleFirst = false;
              }
              this.isMultipleFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  reviewedChange(event: any) {
    if (!this.isReviewedFirst) {
      if (event.source.value == 'All') {
        this.isReviewedFirst = true;
        if (event.source._selected) {
          this.reviewedData.setValue(this.reviewedList);
          localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify([]));
        } else {
          this.reviewedData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify(this.reviewedList));
        }
        this.isReviewedFirst = false;
      } else {
        this.isReviewedFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterReviewed');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isReviewedFirst = true;

            if (this.reviewedData.value[0] == 'All') {
              let data = [...this.reviewedData.value];
              data.splice(0, 1);
              this.reviewedData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify(['All', event.source.value]));
            }
            this.isReviewedFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isReviewedFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify(filter));
              if ((this.reviewedData.value.length + 1) == this.reviewedList.length) {
                this.isReviewedFirst = true;
                this.reviewedData.setValue(this.reviewedList);
                localStorage.setItem('sabResponseProgressFilterReviewed', JSON.stringify([]));
                this.isReviewedFirst = false;
              }
              this.isReviewedFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  reminderCountChange(event: any) {
    if (!this.isReminderCountFirst) {
      if (event.source.value == 'All') {
        this.isReminderCountFirst = true;
        if (event.source._selected) {
          this.reminderCountData.setValue(this.reminderCountList);
          localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify([]));
        } else {
          this.reminderCountData.setValue([]);
          localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify(this.reminderCountList));
        }
        this.isReminderCountFirst = false;
      } else {
        this.isReminderCountFirst = true;
        let filter: any = localStorage.getItem('sabResponseProgressFilterReminderCount');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isReminderCountFirst = true;

            if (this.reminderCountData.value[0] == 'All') {
              let data = [...this.reminderCountData.value];
              data.splice(0, 1);
              this.reminderCountData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify(['All', event.source.value]));
            }
            this.isReminderCountFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isReminderCountFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify(filter));
              if ((this.reminderCountData.value.length + 1) == this.reminderCountList.length) {
                this.isReminderCountFirst = true;
                this.reminderCountData.setValue(this.reminderCountList);
                localStorage.setItem('sabResponseProgressFilterReminderCount', JSON.stringify([]));
                this.isReminderCountFirst = false;
              }
              this.isReminderCountFirst = false;
            }, 300)
          }
        }

      }
      this.updateDataSource();
    }
  }

  updateDataSource() {
    setTimeout(() => {
      let type: any[] = [];
      let sequence: any[] = [];
      let department: any[] = [];
      let status: any[] = [];
      let directorate: any[] = [];
      let onBehalf: any[] = [];
      let multiple: any[] = [];
      let reminder: any[] = [];
      let reviewed:any[] = [];
      this.typeData.value.map((typeData: any) => {
        this.inboxItems.map((data: any) => {
          if (typeData != 'All') {
            if (typeData == data.responseType) {
              type.push(data);
            }
          }
        })
      })
      this.sequenceData.value.map((sequenceData: any) => {
        type.map((data: any) => {
          if (sequenceData != 'All') {
            if (sequenceData == data.obsSeq) {
              sequence.push(data);
            }
          }
        })
      })
      this.departmentData.value.map((departmentData: any) => {
        sequence.map(data => {
          if (departmentData != 'All') {
            const dipartmentArr = data.deptName.split(";");
            dipartmentArr.map((dept: any) => {
              if (departmentData == dept.trim()) {
                let isAvailable = false;
                department.map(val => {
                  if (val.stepCustomId == data.stepCustomId) {
                    isAvailable = true;
                  }
                })
                if (!isAvailable) {
                  department.push(data);
                }
              }
            });
          }
        })
      })
      this.statusData.value.map((statusData: any) => {
        department.map(data => {
          if (statusData != 'All') {
            if (statusData == data.responseStatus) {
              status.push(data);
            }
          }
        })
      })
      this.directorateData.value.map((directorateData: any) => {
        status.map(data => {
          if (directorateData != 'All') {
            const directorateArr = data.directorateName.split(";");
            directorateArr.map((direc: any) => {
              if (directorateData == direc.trim()) {
                let isAvailable = false;
                directorate.map(val => {
                  if (val.stepCustomId == data.stepCustomId) {
                    isAvailable = true;
                  }
                })
                if (!isAvailable) {
                  directorate.push(data);
                }
              }
            });
          }
        })
      })
      this.onBehalfData.value.map((onBehalfData: any) => {
        directorate.map(data => {
          if (onBehalfData != 'All') {
            if (onBehalfData == data.respondOnBehalf) {
              onBehalf.push(data);
            }
          }
        })
      })
      this.multipleData.value.map((multipleData: any) => {
        onBehalf.map(data => {
          if (multipleData != 'All') {
            if (multipleData == data.sentToMultipleDept) {
              multiple.push(data);
            }
          }
        })
      })

      this.reminderCountData.value.map((reminderCountData: any) => {
        multiple.map(data => {
          if (reminderCountData != 'All') {
            if (reminderCountData == data.reminderCount) {
              reminder.push(data);
            }
          }
        })
      })

      this.reviewedData.value.map((reviewedData: any) => {
        reminder.map(data => {
          if (reviewedData != 'All') {
            if (reviewedData == data.reviewed) {
              reviewed.push(data);
            }
          }
        })
      })
      this.dataSource.data = reviewed;
      this.dataSource.data.sort((a, b) => {
        return a.obsSeq - b.obsSeq;
      });
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, 300)
  }

  onPaginateChange(event: any) {
    this.pageIndex = event.pageIndex;
    localStorage.setItem('sabPaginatorResponseProgressIndex', JSON.stringify(this.pageIndex));
  }

  checkResponseProgressData() {
    // localStorage.setItem('sabResponseProgressFilterType', JSON.stringify(this.typeData.value));
    // localStorage.setItem('sabResponseProgressFilterSequence', JSON.stringify(this.sequenceData.value));
    // localStorage.setItem('sabResponseProgressFilterDepartment', JSON.stringify(this.departmentData.value));
    // localStorage.setItem('sabResponseProgressFilterStatus', JSON.stringify(this.statusData.value));
    // localStorage.setItem('sabResponseProgressFilterDirectorate', JSON.stringify(this.directorateData.value));
    // localStorage.setItem('sabResponseProgressFilterBehalf', JSON.stringify(this.onBehalfData.value));
    // localStorage.setItem('sabResponseProgressFilterMultipleDept', JSON.stringify(this.multipleData.value));

    let url = 'InProgController/InProgWorkItems?isAdmin=' + this.isAdmin + '&userLogin=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&behalfUserTitle=' + this.selectedDelegateUserInfo.userJobTitle+ '&behalfUserDeptCode=' + this.selectedDelegateUserInfo.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      // url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      if (this.userJobTitle == 'SEC') {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle  +'&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId+ '&behalfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle+ '&behalfUserDeptCode=' + this.userInformation.supervisorDetails.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode +'&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    // this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
        //  response = [{"obsId":"2021-2022-1","obsSeq":1,"obsTitle":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Corporate Legal ;Information Technology ;Corporate Planning ;","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Chief Executive Officer's Office ;Deputy C.E.O. For Support Services ;Deputy C.E.O. For Planning & Finance ;","respondOnBehalf":"No","sentToMultipleDept":"Yes","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Normal","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-2","obsSeq":2,"obsTitle":"    س- \tاستمرار عدم قيام الشركة بتطبيق غرامات التأخير (PTOF) البالغة 122,400,000/000 دينار كويتي على مقاولي الحزم حتى","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Chief Executive Officer's Office","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Chief Executive Officer's Office","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Special Nature","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-3","obsSeq":3,"obsTitle":"   2- \tالملاحظات الخاصة بالعقد رقم (CFP/MISC/0064):","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Corporate Planning ;","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Deputy C.E.O. For Planning & Finance ;","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Normal","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-4","obsSeq":4,"obsTitle":"  3- \tالملاحظات الخاصة بمطالبات المقاولين:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Committee","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Committee","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-5","obsSeq":5,"obsTitle":"   4- \tالملاحظات الخاصة بعقد الاستشاري الرئيسي لمشروع الوقود البيئي: ","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Corporate Planning ;","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Deputy C.E.O. For Planning & Finance ;","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Normal","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-6","obsSeq":6,"obsTitle":"   5- \tانخفاض أعداد مشغلي المقاول ومشغلي الشركة في عقد إدارة التشغيل:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"N/A","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-7","obsSeq":7,"obsTitle":"   6- \tالملاحظات المتعلقة بعقود المقاولين البديلين لمشروع الوقود البيئي:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Corporate Planning ;","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Deputy C.E.O. For Planning & Finance ;","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Normal","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-8","obsSeq":8,"obsTitle":"ثانياً: \tالملاحظات المتعلقة بالعقود والمناقصات:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"N/A","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-9","obsSeq":9,"obsTitle":"  2- \tالملاحظات المتعلقة بالعقد رقم (CB/CSPD/2008/CNSL) بشأن تقديم أعمال استشارية لمشروعات مصافي الشركة:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"N/A","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-10","obsSeq":10,"obsTitle":"  3- \tالملاحظات المتعلقة بعقدي خدمات ضبط الجودة لمصافي الشركة:","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"N/A","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-11","obsSeq":11,"obsTitle":"   4- \tالملاحظات المتعلقة بالعقد رقم (CA/4116):","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Information Technology ;Corporate Planning ;","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Deputy C.E.O. For Support Services ;Deputy C.E.O. For Planning & Finance ;","respondOnBehalf":"No","sentToMultipleDept":"Yes","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Normal","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"},{"obsId":"2021-2022-12","obsSeq":12,"obsTitle":"   5- \tالملاحظات المتعلقة بالعقد رقم (CA/4104):","sentDate":"02/04/2022 19:38","reportName":"KNPC Response Report","deptName":"Chief Executive Officer's Office","reminderCount":0,"responseStatus":"Pending To Launch","directorateName":"Chief Executive Officer's Office","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"","obsCategory":"Special Nature","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"","stepUnqName":"GPA-Pending-Extraction","responseType":"N"}]
      if (!_.isEqual(JSON.stringify(response), JSON.stringify(this.inboxItems))) {
        this.typeData = new FormControl();
        let oldTypeList = this.typeList;
        this.typeList = ['All'];
        this.isTypeFirst = true;
        this.sequenceData = new FormControl();
        let oldSequenceList = this.sequenceList
        this.sequenceList = ['All'];
        this.isSequenceFirst = true;
        this.departmentData = new FormControl();
        let oldDepartmentList = this.departmentList
        this.departmentList = ['All'];
        this.isDepartmentFirst = true;
        this.statusData = new FormControl();
        let oldStatusList = this.statusList
        this.statusList = ['All'];
        this.isStatusFirst = true;
        this.directorateData = new FormControl();
        let oldDirectorateList = this.directorateList
        this.directorateList = ['All'];
        this.isDirectorateFirst = true;
        this.onBehalfData = new FormControl();
        let OldOnBehalfList = this.onBehalfList
        this.onBehalfList = ['All'];
        this.isOnBehalfFirst = true;
        this.multipleData = new FormControl();
        this.reviewedData = new FormControl();
        this.reminderCountData = new FormControl();
        let oldMultipleList = this.multipleList
        let oldReviewedList = this.reviewedList
        let oldReminderCountList = this.reminderCountList
        this.multipleList = ['All'];
        this.reviewedList = ['All'];
        this.reminderCountList = ['All']
        this.isMultipleFirst = true;
        this.isReviewedFirst = true;
        this.isReminderCountFirst = true;
        let reminderCountList : any = [];
        // this.isLoading = false;
        // this._loading.setLoading(false, url);
        let isNADepartmentAvailable = false;
        let isNADirectorateAvailable = false;
        let filterType = localStorage.getItem('sabResponseProgressFilterType');
        let filterSequence = localStorage.getItem('sabResponseProgressFilterSequence');
        let filterDepartment = localStorage.getItem('sabResponseProgressFilterDepartment');
        let filterStatus = localStorage.getItem('sabResponseProgressFilterStatus');
        let filterDirectorate = localStorage.getItem('sabResponseProgressFilterDirectorate');
        let filterBehalf = localStorage.getItem('sabResponseProgressFilterBehalf');
        let filterMultipleDept = localStorage.getItem('sabResponseProgressFilterMultipleDept');
        let filterReviewed = localStorage.getItem('sabResponseProgressFilterReviewed');
        
        let filterReminderCount = localStorage.getItem('sabResponseProgressFilterReminderCount');
        let isFilterSelected = false;
        this.sharedVariableService.setResponseInProgValue(response.length);
        response.map(async (data: any, i: any) => {
          let sendDate = response[i].sentDate.replaceAll('/', '-');
          let time = sendDate.split(' ')
          sendDate  = time[0].split('-')
          let onlyDate = sendDate[0]
          sendDate[0] = sendDate[2]
          sendDate[2] = onlyDate
          sendDate = sendDate.join('-')
          sendDate = sendDate + ' ' + time[1]
          sendDate = new Date(sendDate)
        
        response[i].sentDate = sendDate
          data.reminderCount = data.reminderCount || 0;
          data.stepCustomId = data.stepUnqName != 'GPA-Pending-Extraction' ? data.stepCustomId  : data.obsId;
          this.typeList.push(data.responseType);
          this.sequenceList.push(data.obsSeq);
          if (data.deptName == "N/A") {
            isNADepartmentAvailable = true;
          } else {
            const department = data.deptName.split(";");
            department.map((dep: any) => {
              if(dep.trim() != ''){
                this.departmentList.push(dep.trim());
              }
            });
          }
          if (data.directorateName == "N/A") {
            isNADirectorateAvailable = true;
          } else {
            const directorate = data.directorateName.split(";");
            directorate.map((direc: any) => {
              if(direc.trim()){
                this.directorateList.push(direc.trim());
              }              
            });
          }
          this.statusList.push(data.responseStatus);
          this.onBehalfList.push(data.respondOnBehalf);
          this.multipleList.push(data.sentToMultipleDept);
          this.reviewedList.push(data.reviewed); 
          reminderCountList.push(data.reminderCount)
          let changedSelected = await this.dataSource.data.filter(item => { return ((data.stepCustomId == item.stepCustomId && data.stepUnqName !="GPA-Pending-Extraction") || (data.obsId == item.obsId && data.stepUnqName =="GPA-Pending-Extraction"))  });
					if (changedSelected.length > 0) {
						data['isSelected'] = changedSelected[0].hasOwnProperty('isSelected') ? changedSelected[0].isSelected : false
					}
          // data.isExpanded = true;
        })
        let typeSet = new Set(this.typeList);
        this.typeList = [...typeSet];
        if (filterType != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterType, this.typeList, oldTypeList)
          this.typeData.setValue(filterValue);
        } else {
          this.typeData.setValue(this.typeList);
        }
        // this.typeData.setValue(this.typeList);
        let sequenceSet = new Set(this.sequenceList);
        this.sequenceList = [...sequenceSet];
        if (filterSequence != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterSequence, this.sequenceList, oldSequenceList)
          this.sequenceData.setValue(filterValue);
        } else {
          this.sequenceData.setValue(this.sequenceList);
        }
        // this.sequenceData.setValue(this.sequenceList);
        let departmentSet = new Set(this.departmentList);
        this.departmentList = [...departmentSet];
        this.departmentList.sort();
        if (isNADepartmentAvailable) {
          this.departmentList.push('N/A');
        }
        if (filterDepartment != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterDepartment, this.departmentList, oldDepartmentList)
          this.departmentData.setValue(filterValue);
        } else {
          this.departmentData.setValue(this.departmentList);
        }
        // this.departmentData.setValue(this.departmentList);
        let statusSet = new Set(this.statusList);
        this.statusList = [...statusSet];
        this.statusList.sort();
        if (filterStatus != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterStatus, this.statusList, oldStatusList)
          this.statusData.setValue(filterValue);
        } else {
          this.statusData.setValue(this.statusList);
        }
        // this.statusData.setValue(this.statusList);
        let directorateSet = new Set(this.directorateList);
        this.directorateList = [...directorateSet];
        this.directorateList.sort();
        if (isNADirectorateAvailable) {
          this.directorateList.push('N/A');
        }
        if (filterDirectorate != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterDirectorate, this.directorateList, oldDirectorateList)
          this.directorateData.setValue(filterValue);
        } else {
          this.directorateData.setValue(this.directorateList);
        }
        // this.directorateData.setValue(this.directorateList);
        let onBehalfSet = new Set(this.onBehalfList);
        this.onBehalfList = [...onBehalfSet];
        if (filterBehalf != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterBehalf, this.onBehalfList, OldOnBehalfList)
          this.onBehalfData.setValue(filterValue);
        } else {
          this.onBehalfData.setValue(this.onBehalfList);
        }
        // this.onBehalfData.setValue(this.onBehalfList);
        let multipleSet = new Set(this.multipleList);
        this.multipleList = [...multipleSet];
        if (filterMultipleDept != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterMultipleDept, this.multipleList, oldMultipleList)
          this.multipleData.setValue(filterValue);
        } else {
          this.multipleData.setValue(this.multipleList);
        }

        let reviewedSet = new Set(this.reviewedList);
        this.reviewedList = [...reviewedSet];
        if (filterReviewed != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterReviewed, this.reviewedList, oldReviewedList)
          this.reviewedData.setValue(filterValue);
        } else {
          this.reviewedData.setValue(this.reviewedList);
        }

        let reminderCountSet = new Set(reminderCountList);
        reminderCountList = [...reminderCountSet];
        reminderCountList.sort();
        this.reminderCountList = [...this.reminderCountList, ...reminderCountList ]
        if (filterReminderCount != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterReminderCount, this.reminderCountList, oldReminderCountList)
          this.reminderCountData.setValue(filterValue);
        } else {
          this.reminderCountData.setValue(this.reminderCountList);
        }
        this.inboxItems = response;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.data.sort((a, b) => {
          return a.obsSeq - b.obsSeq;
        });
        if (isFilterSelected) {
          this.updateDataSource();
        }
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        setTimeout(() => {
          this.isTypeFirst = false;
          this.isSequenceFirst = false;
          this.isDepartmentFirst = false;
          this.isStatusFirst = false;
          this.isDirectorateFirst = false;
          this.isOnBehalfFirst = false;
          this.isMultipleFirst = false;
          this.isReviewedFirst = false
          this.isReminderCountFirst = false;
          // this.setAnchorTagSize();
        }, 500)
      } else {
        this.sharedVariableService.setResponseInProgValue(response.length);
      }
    }, error => {
      // this.isLoading = false;
      // this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  generateDraft() {
    var stepIds: string = '';
    this.selectedRow.map((data, i) => {
      if (i != 0) {
        stepIds = `${stepIds},${data.obsId}`;
      } else {
        stepIds = `${data.obsId}`
      }
    })
    let url = 'ReportController/generateDraft?reportYear=' + this.reportYear + '&reportCycle=' + this.reportCycle +'&obsIds=' + stepIds;
    window.open(this.mainUrl + url, '_parent');
  }

  selectionChange(data: any, row: any) {
    let find = false;
    this.isSendReminder = false;
    let isEditStepFind = false;
    this.isEditResponse = false;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if ((this.dataSource.data[i].stepCustomId == row.stepCustomId && data.stepUnqName != 'GPA-Pending-Extraction') ||  (this.dataSource.data[i].obsId == row.obsId && data.stepUnqName == 'GPA-Pending-Extraction')) {
        this.dataSource.data[i].isSelected = this.dataSource.data[i].hasOwnProperty('isSelected') ? !this.dataSource.data[i].isSelected : true;
        if (this.dataSource.data[i].isSelected) {
          this.selectedRow.push(this.dataSource.data[i])
        } else {
          for (let j = 0; j < this.selectedRow.length; j++) {
            if ((this.selectedRow[j].stepCustomId == this.dataSource.data[i].stepCustomId && data.stepUnqName != 'GPA-Pending-Extraction') || this.selectedRow[j].obsId == this.dataSource.data[i].obsId && data.stepUnqName == 'GPA-Pending-Extraction') {
              this.selectedRow.splice(j, 1);
              break;
            }
          }

        }
      }
    }
    this.isSendReminder = false;
    this.isEditResponse = false;
    this.isReviewButtonEnabled = true;
    this.selectedRow.map((data: any) => {
      if(data?.reviewed == "yes"){    
        this.isReviewButtonEnabled = false;
      }
      if (data.stepUnqName == 'NORMAL-DCEO-OR-CEO-APPROVAL' || data.stepUnqName == 'G&PAApprove' || data.stepUnqName == 'G&PAReview' || data.stepUnqName == "MGR-PENDING-COMBINING" || 
      data.stepUnqName == "G&PACOombineResponse" ||    data.stepUnqName == "SN-CEO-APPROVAL-COMBINE" || data.stepUnqName == "GPA-ASSIGN" ||
        data.stepUnqName == "G&PA Park" || data.stepUnqName == "G&PAApprove-EditResponse" || data.stepUnqName == 'GPA-Pending-Extraction' ) {
        find = true;
        this.isSendReminder = false;
      }
      else {
        this.isSendReminder = false;
      }
      if (!find) {
        this.isSendReminder = true;
      }

      if (data.stepUnqName != "G&PA Park") {
        isEditStepFind = true;
        this.isEditResponse = false;
      }
      else {
        this.isEditResponse = false;
      }
      if (!isEditStepFind) {
        this.isEditResponse = true;
      }
    })
    if (find) {
      this.isSendReminder = false;
    }
    if (isEditStepFind) {
      this.isEditResponse = false;
    }
  }

  sendReminder() {
    let url = `InProgController/sendReminder?sentByUserId=${this.userId}&wiIds=`;
    //this.isLoading = true;
    var stepIds: string = '';
    this.selectedRow.map((data,i) => {
      if(i != 0){
        stepIds = `${stepIds},${data.stepCustomId}`;
      }else{
        stepIds = `${data.stepCustomId}`
      }
    })    
    url = `${url}${stepIds}`;
    if (this.selectedDelegateUserInfo) {
      url = url +'&isAdmin='+this.isAdmin + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url +'&isAdmin='+this.isAdmin  + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url +'&isAdmin='+this.isAdmin  + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }
    }
    

    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
     this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];    
      this.getResponseProgressData();
      this.notification.create('success', 'Success', "Reminder sent successfully");
      this.isSendReminder =false;
    }, error => {
      this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];    
      this.getResponseProgressData();
      console.log('err  :', error);
    });
  }
  onEditResponse(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'Edit Response',
        dialogMessage: 'ARE_YOU_SURE_EDIT_RESPONSE_OBSERVATIONS'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onEditResponse(result);
      }
    });
  }

  _onEditResponse(result: any): void {
    // this.isDialogLoading = true;    
    // let url = 'InProgController/editResponse?stepCustomId=' + this.id + '&userName=' + this.userInformation.sabMember.userName + '&comment=' + result.data.comment + '&departmentCode=' + this.departmentCode + '&userobTitle=' + this.userJobTitle + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + "&r=" + (Math.floor(Math.random() * 100) + 100);
    var stepIds: string = '';
    this.selectedRow.map((data, i) => {
      if (i != 0) {
        stepIds = `${stepIds},${data.stepCustomId}`;
      } else {
        stepIds = `${data.stepCustomId}`
      }
    })
    let url = 'InProgController/editResponse?stepCustomId=' + stepIds + '&userName=' + this.userName + '&comment=' + result.data.comment + '&departmentCode=' + this.departmentCode + '&userLogin=' + this.userId + '&isAdmin=' + this.isAdmin + '&loginId=';;
    if (this.selectedDelegateUserInfo) {
      url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }
    }
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.isEditResponse = false;
      this.selection.clear();
      this.selectedRow = [];
      this.getResponseProgressData();
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.isEditResponse = false;
      this.selection.clear();
      this.selectedRow = [];
      console.log('err  :', error);
    });
  }

  onReviewed(stepId: any, isReview: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'REVIEWED',
        dialogMessage: 'ARE_YOU_SURE_YOU_REVIEWED_OBSERVATIONS'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onReviewed(stepId, isReview);
      }
    });
  }

  _onReviewed(stepId: any, isReview: string): void {   
    let url = `InProgController/reviewObservation?stepCustomId=${stepId}&isReviewed=${isReview}&r=${
      Math.floor(Math.random() * 100) + 100
    }`;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(
      (response) => {
        this.notification.create(
          'success',
          'Success',
          'G&PA TL review status updated successfully'
        );
        this._loading.setLoading(false, url);
        this.isEditResponse = false;
        this.selection.clear();
        this.selectedRow = [];
        this.getResponseProgressData();
      },
      (error) => {
        this._loading.setLoading(false, url);
        console.log('err  :', error);
      }
    );
  }


  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    return;
    if(this.isAdmin){
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'item': item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onContextMenuAction1(row: any) {
    let serverHost = location.href.split('/#/')
    if (row.responseStatus == 'Pending Combine & Complete Response' || row.responseStatus == 'Pending Combine Response Update' || row.responseStatus == 'Pending Combine Response') {
      let _sec = 'No';
      if (this.userJobTitle == 'SEC' && !this.userInformation.isAdmin) {
        _sec = 'Yes';
      }
      let url = 'workItemController/getResponseCount?stepCustomId=' + row.stepCustomId;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        // if (response > 1) {
        //   let url = `${serverHost[0]}/#/inbox/combine-responses/${row.stepCustomId}?isSecretary=${_sec}`
          
          if(this.selectedDelegateUserInfo){
            url = url + '&isDelegated=true';
          }else if(this.userJobTitle == 'SEC'){
            url = url + '&isSec=true';
          }
        //   window.open(url);
        // } else {
        //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        //     data: {
        //       dialogHeader: 'INFORMATION',
        //       dialogMessage: 'PLEASE_WAIT'
        //     }
        //   });
        // }
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });

    } else {
      let url;
      if(this.isAdmin){
       // this.router.navigate(['response-progress/work-item-details', row.stepCustomId],{ queryParams: {obsId: row.obsId, stepUnqName: row.stepUnqName}});
       url = `${serverHost[0]}/#/response-progress/work-item-details/${row.stepCustomId}?obsId=${row.obsId}&stepUnqName=${row.stepUnqName}`
      }else{
        // this.router.navigate(['response-progress/work-item-details', row.stepCustomId],{ queryParams: {obsId: row.obsId, stepUnqName: row.stepUnqName, pendingUser:row.pendingUser}});
        url = `${serverHost[0]}/#/response-progress/work-item-details/${row.stepCustomId}?obsId=${row.obsId}&stepUnqName=${row.stepUnqName}&pendingUser=${row.pendingUser}`
      }
      // let url = `${serverHost[0]}/#/response-progress/work-item-details/${row.stepCustomId}`
      // if(this.selectedDelegateUserInfo){
      //   console.log('ll');

      //   url = url + '&isDelegated=true';
      // }else if(this.userJobTitle == 'SEC'){
      //   url = url + '&isSec=true';
      // }
      // for(let i = 0;i< 5; i++){
      //   window.open(url);
      // }
      // const linkElement = document.getElementById("yourLinkId") as HTMLAnchorElement;
      // linkElement.addEventListener("click", (event) => {
      //   event.preventDefault(); // Prevent the default link behavior
      //   const url = linkElement.href;
      //   window.location.assign(url); // Open the URL in a new tab (if supported)
      // });

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    
  }
}

