import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface PeriodicElement {
  obsTitle: string;
  obsSeq: number;
  receievedDate: string;
  reportName: string;
  deptName: string;
  responseStatus: string;
  stepCustomId: string;
}

@Component({
  selector: 'app-sent-items',
  templateUrl: './sent-items.component.html',
  styleUrls: ['./sent-items.component.css']
})
export class SentItemsComponent implements OnInit {
  isRtl: any;
  isLoading: boolean = true;
  userId: string;
  userJobTitle: string;
  departmentCode: string;
  typeList: string[] = ['All'];
  sequenceList: string[] = ['All'];
  departmentList: string[] = ['All'];
  statusList: string[] = ['All'];
  directorateList: string[] = ['All'];
  onBehalfList: string[] = ['All'];
  multipleList: string[] = ['All'];
  typeData = new FormControl();
  sequenceData = new FormControl();
  departmentData = new FormControl();
  statusData = new FormControl();
  directorateData = new FormControl();
  onBehalfData = new FormControl();
  multipleData = new FormControl();
  isTypeFirst: any = true;
  isSequenceFirst: any = true;
  isDepartmentFirst: any = true;
  isStatusFirst: any = true;
  isDirectorateFirst: any = true;
  isOnBehalfFirst: any = true;
  isMultipleFirst: any = true;
  inboxItems: any;
  dataSource: MatTableDataSource<PeriodicElement>;
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['type', 'obsSeq', 'obsTitle', 'sentDate', 'reportName', 'deptName', 'responseStatus', 'directorate', 'respondOnBehalf', 'sendToMultipleDepartment', 'pendingUser'];
  displayedColumnsMob: string[] = ['obsTitle', 'sentDate'];
  displayedColumnsSmallMob: string[] = ['obsTitle'];
  pageIndex: string | null;
  selectedDelegateUserInfo: any;
  userInformation: any;
  isAdmin: any;
  innerWidth = 0;
  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.pageIndex = localStorage.getItem('sabPaginatorSentItemsIndex');
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabDelegateUser');
    if (data) {
      this.selectedDelegateUserInfo = JSON.parse(data);
    }
    // this.userId = localStorage.getItem('loginId') || '';
    // this.userJobTitle = localStorage.getItem('userJobTitle') || '';
    // this.departmentCode = localStorage.getItem('departmentCode') || '';
    let userData: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(userData);

    this.userId = this.userInformation.sabMember.loginId ;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle ;
    this.departmentCode = localStorage.getItem('departmentCode') || '';

    this.isAdmin = this.userInformation.admin;
    this.getSentItemsData();
    this.innerWidth =  window.innerWidth;
  }

  getSentItemsData() {
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
    this.multipleList = ['All'];
    this.isMultipleFirst = true;
    let url = 'SentItemController/SentWorkItems?userLogin=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode;
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId  + '&behalfUserTitle=' + this.selectedDelegateUserInfo.userJobTitle+ '&behalfUserDeptCode=' + this.selectedDelegateUserInfo.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
       if (this.userJobTitle == 'SEC') {
        url = url +  '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&behalfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle+ '&behalfUserDeptCode=' + this.userInformation.supervisorDetails.departmentCode+ '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
      // response = [{"obsId":"2020-2021-1","obsSeq":1,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 11:28","reportName":"KNPC Response Report","deptName":"Corporate Planning","responseStatus":"Pending Response","directorateName":"Deputy C.E.O. For Planning & Finance","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"ECMTest User2","stepCustomId":"76cd70d3-f143-46ce-b9a0-260d63513be8","obsCategory":"Normal","deptCode":0,"responseTaken":"Assign","prevStepUnqName":"ManagerAssignStaff","currentRole":"EngOrSrEng","previousRole":"Manager","stepUnqName":"PENDING_RESPONSE","responseType":"SO"},{"obsId":"2020-2021-2","obsSeq":2,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"088aa713-3a0e-4830-82a6-10d04b6b5a5b","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-3","obsSeq":3,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"cac4bb61-7278-4792-a67b-c6a68a6a9b16","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-4","obsSeq":4,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"71e9be4f-1c53-4966-8e2a-2305c8cc5276","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-5","obsSeq":5,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"f3048e69-e621-4bf4-805f-fb02f492a7bc","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-6","obsSeq":6,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"61279240-a739-465e-87d2-33762919ea71","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-7","obsSeq":7,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"61063a9e-515e-4400-a223-2ffc1e673b4a","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-8","obsSeq":8,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"364d40a9-a878-401a-b7dd-2af426cb5459","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-9","obsSeq":9,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"23c60531-3494-43b0-87a0-24c5ac716b4b","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-10","obsSeq":10,"obsTitle":"أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"1522b729-b898-4b52-acea-55caf841298a","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-11","obsSeq":11,"obsTitle":"2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"03c77f98-f25a-4317-a177-dad0ba196a8d","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"},{"obsId":"2020-2021-12","obsSeq":12,"obsTitle":"   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:","sentDate":"04/01/2022 09:27","reportName":"KNPC Response Report","deptName":"N/A","responseStatus":"Pending Assignment to Department","directorateName":"N/A","respondOnBehalf":"No","sentToMultipleDept":"No","pendingUser":"G&PA Team","stepCustomId":"1a1dd34e-83dd-450b-9898-dabac22c0e10","obsCategory":"","deptCode":0,"responseTaken":"","currentRole":"G&PA Team","previousRole":"G&PA Team","stepUnqName":"GPA-ASSIGN","responseType":"N"}]
      this.isLoading = false;
      this._loading.setLoading(false, url);
      let filterType = localStorage.getItem('sabSentItemsFilterType');
      let filterSequence = localStorage.getItem('sabSentItemsFilterSequence');
      let filterDepartment = localStorage.getItem('sabSentItemsFilterDepartment');
      let filterStatus = localStorage.getItem('sabSentItemsFilterStatus');
      let filterDirectorate = localStorage.getItem('sabSentItemsFilterDirectorate');
      let filterBehalf = localStorage.getItem('sabSentItemsFilterBehalf');
      let filterMultipleDept = localStorage.getItem('sabSentItemsFilterMultipleDept');
      let isFilterSelected = false;
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
        this.typeList.push(data.responseType);
        this.sequenceList.push(data.obsSeq);
        const department = data.deptName.split(";");
        department.map((dep: any) => {
          this.departmentList.push(dep.trim());
        });
        this.statusList.push(data.responseStatus);
        const directorate = data.directorateName.split(";");
        directorate.map((direc: any) => {
          this.directorateList.push(direc.trim());
        });
        this.onBehalfList.push(data.respondOnBehalf);
        this.multipleList.push(data.sentToMultipleDept);
        data.isExpanded = true;
      })
      let typeSet = new Set(this.typeList);
      this.typeList = [...typeSet];
      if (filterType != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterType,this.typeList)
        this.typeData.setValue(filterValue);   
      } else {
        this.typeData.setValue(this.typeList);
      }
      // this.typeData.setValue(this.typeList);
      let sequenceSet = new Set(this.sequenceList);
      this.sequenceList = [...sequenceSet];
      if (filterSequence != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterSequence,this.sequenceList)
          this.sequenceData.setValue(filterValue);  
      } else {
        this.sequenceData.setValue(this.sequenceList);
      }
      // this.sequenceData.setValue(this.sequenceList);
      let departmentSet = new Set(this.departmentList);
      this.departmentList = [...departmentSet];
      if (filterDepartment != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterDepartment,this.departmentList)
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
        let filterValue = await this.applyOldFilter(filterStatus,this.statusList)
        this.statusData.setValue(filterValue);  
      } else {
        this.statusData.setValue(this.statusList);
      }
      // this.statusData.setValue(this.statusList);
      let directorateSet = new Set(this.directorateList);
      this.directorateList = [...directorateSet];
      if (filterDirectorate != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterDirectorate,this.directorateList)
        this.directorateData.setValue(filterValue);  
      } else {
        this.directorateData.setValue(this.directorateList);
      }
      // this.directorateData.setValue(this.directorateList);
      let onBehalfSet = new Set(this.onBehalfList);
      this.onBehalfList = [...onBehalfSet];
      if (filterBehalf != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterBehalf,this.onBehalfList)
          this.onBehalfData.setValue(filterValue);
      } else {
        this.onBehalfData.setValue(this.onBehalfList);
      }
      // this.onBehalfData.setValue(this.onBehalfList);
      let multipleSet = new Set(this.multipleList);
      this.multipleList = [...multipleSet];
      if (filterMultipleDept != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterMultipleDept,this.multipleList)
        this.multipleData.setValue(filterValue);
      } else {
        this.multipleData.setValue(this.multipleList);
      }
      // this.multipleData.setValue(this.multipleList);
      this.inboxItems = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.data.sort((a, b) => {
        return a.obsSeq - b.obsSeq;
       });
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
      if (isFilterSelected) {
        this.updateDataSource();
      }
      setTimeout(() => {
        this.isTypeFirst = false;
        this.isSequenceFirst = false;
        this.isDepartmentFirst = false;
        this.isStatusFirst = false;
        this.isDirectorateFirst = false;
        this.isOnBehalfFirst = false;
        this.isMultipleFirst = false;
      }, 500)
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
  applyOldFilter(filterType:any,list:any){
    let filterValue :any = [];
    filterType = JSON.parse(filterType)
    for(let i = 0 ; i < list.length ; i++){
      for(let j = 0 ; j < filterType.length ; j++){
        if(list[i] == filterType[j]){
          filterValue.push(list[i])
        }      
      }
    }    
    if(filterValue.length > 0){
      return filterValue;
    }else{
      return list
    }
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.obsSeq + 1}`;
  }

  navigateTo(row: any) {
    localStorage.setItem('sabSentItemsFilterType', JSON.stringify(this.typeData.value));
    localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify(this.sequenceData.value));
    localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify(this.departmentData.value));
    localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify(this.statusData.value));
    localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify(this.directorateData.value));
    localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify(this.onBehalfData.value));
    localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify(this.multipleData.value));
    // this.router.navigate(['sent-items/work-item-details', row.stepCustomId]);
    
    //   this.router.navigate(['sent-items/work-item-details', row.stepCustomId]);
      let responseItems = []
      let selectedIndex = 0;
      let matched = false;
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].stepCustomId == row.stepCustomId) {
          matched = true;
        }
        
          if(matched == false){
            selectedIndex =  selectedIndex + 1;
          }
          responseItems.push({
            stepCustomId: this.dataSource.data[i].stepCustomId,
          })
        
        if (this.dataSource.data.length - 1 == i) {
          localStorage.setItem('sentItems', JSON.stringify(responseItems))
          localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex))
        }
      }
      this.router.navigate(['sent-items/work-item-details', row.stepCustomId],{queryParams : {selectedIndex: selectedIndex}});
    
  }

  typeChange(event: any) {
    if (!this.isTypeFirst) {
      if (event.source.value == 'All') {
        this.isTypeFirst = true;
        if (event.source._selected) {
          this.typeData.setValue(this.typeList);
          localStorage.setItem('sabSentItemsFilterType', JSON.stringify([]));
        } else {
          this.typeData.setValue([]);
          localStorage.setItem('sabSentItemsFilterType', JSON.stringify(this.typeList));
        }
        this.isTypeFirst = false;
      } else {
        this.isTypeFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterType');
  
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
            localStorage.setItem('sabSentItemsFilterType', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterType', JSON.stringify(['All',event.source.value]));
          }
          this.isTypeFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isTypeFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterType', JSON.stringify(filter));          
              if ((this.typeData.value.length + 1) == this.typeList.length) {
                this.isTypeFirst = true;
                this.typeData.setValue(this.typeList);
                localStorage.setItem('sabSentItemsFilterType', JSON.stringify([]));
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
          localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify([]));
        } else {
          this.sequenceData.setValue([]);
          localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify(this.sequenceList));
        }
        this.isSequenceFirst = false;
      } else {
        this.isSequenceFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterSequence');
  
        if (!event.source._selected) {
          setTimeout(() => { 
          this.isSequenceFirst = true;
        
            if (this.sequenceData.value[0] == 'All') {
              let data = [...this.sequenceData.value];
              data.splice(0, 1);
              this.sequenceData.setValue(data); 
            }           
          
          if (filter &&  JSON.parse(filter).length > 0) {
            filter = JSON.parse(filter)
            filter = [...filter, event.source.value]           
            localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify(['All',event.source.value]));
          }
          this.isSequenceFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isSequenceFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify(filter));          
              if ((this.sequenceData.value.length + 1) == this.sequenceList.length) {
                this.isSequenceFirst = true;
                this.sequenceData.setValue(this.sequenceList);
                localStorage.setItem('sabSentItemsFilterSequence', JSON.stringify([]));
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
          localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify([]));
        } else {
          this.departmentData.setValue([]);
          localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterDepartment');
  
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
            localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify(['All',event.source.value]));
          }
          this.isDepartmentFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isDepartmentFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify(filter));          
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabSentItemsFilterDepartment', JSON.stringify([]));
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
          localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify([]));
        } else {
          this.statusData.setValue([]);
          localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify(this.statusList));
        }
        this.isStatusFirst = false;
      } else {
        this.isStatusFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterStatus');
  
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
            localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify(['All',event.source.value]));
          }
          this.isStatusFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isStatusFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify(filter));          
              if ((this.statusData.value.length + 1) == this.statusList.length) {
                this.isStatusFirst = true;
                this.statusData.setValue(this.statusList);
                localStorage.setItem('sabSentItemsFilterStatus', JSON.stringify([]));
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
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorateData.setValue(this.directorateList);
          localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify([]));
        } else {
          this.directorateData.setValue([]);
          localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterDirectorate');
  
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
            localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify(['All',event.source.value]));
          }
          this.isDirectorateFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isDirectorateFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify(filter));          
              if ((this.directorateData.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorateData.setValue(this.directorateList);
                localStorage.setItem('sabSentItemsFilterDirectorate', JSON.stringify([]));
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
          localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify([]));
        } else {
          this.onBehalfData.setValue([]);
          localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify(this.onBehalfList));
        }
        this.isOnBehalfFirst = false;
      } else {
        this.isOnBehalfFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterBehalf');
  
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
            localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify(['All',event.source.value]));
          }
          this.isOnBehalfFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isOnBehalfFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify(filter));          
              if ((this.onBehalfData.value.length + 1) == this.onBehalfList.length) {
                this.isOnBehalfFirst = true;
                this.onBehalfData.setValue(this.onBehalfList);
                localStorage.setItem('sabSentItemsFilterBehalf', JSON.stringify([]));
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
          localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify([]));
        } else {
          this.multipleData.setValue([]);
          localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify(this.multipleList));
        }
        this.isMultipleFirst = false;
      } else {
        this.isMultipleFirst = true;
        let filter: any = localStorage.getItem('sabSentItemsFilterMultipleDept');
  
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
            localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify(filter));
          } else {
            localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify(['All',event.source.value]));
          }
          this.isMultipleFirst = false;
        },300)
        } else {
          if (filter) {
            setTimeout(() => {
            this.isMultipleFirst = true;
            filter = JSON.parse(filter);
            let index = filter.indexOf(event.source.value);
            filter.splice(index, 1)
            localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify(filter));          
              if ((this.multipleData.value.length + 1) == this.multipleList.length) {
                this.isMultipleFirst = true;
                this.multipleData.setValue(this.multipleList);
                localStorage.setItem('sabSentItemsFilterMultipleDept', JSON.stringify([]));
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

  updateDataSource() {
    setTimeout(() => {
      let type: any[] = [];
      let sequence: any[] = [];
      let department: any[] = [];
      let status: any[] = [];
      let directorate: any[] = [];
      let onBehalf: any[] = [];
      let multiple: any[] = [];
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
      this.dataSource.data = multiple;
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
    localStorage.setItem('sabPaginatorSentItemsIndex', JSON.stringify(this.pageIndex));
  }
}
