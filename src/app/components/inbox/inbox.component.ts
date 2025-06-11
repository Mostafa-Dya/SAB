import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { WorkItem } from '../../models/edited/work-item.model';
import { InboxItem } from 'src/app/models/inboxItem.model';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { FormControl } from '@angular/forms';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import * as _ from 'lodash';
import { MatMenuTrigger } from '@angular/material/menu';
import { NzNotificationService } from 'ng-zorro-antd/notification';
declare var $: any;
export interface PeriodicElement {
  deptCycleId: any;
  obsId: any;
  responseType: string;
  obsTitle: string;
  obsSeq: number;
  receievedDate: string;
  reportName: string;
  deptName: string;
  responseStatus: string;
  stepCustomId: string;
  obsCategory: string;
  stepUnqName: string;
  previousRole: string;
  callDate: any;
  isSelected: boolean;
  gpaSendBackDate: string;
  isGpaSentBack: boolean;
  isGpaEditSentBack: boolean;
  responseTaken: string;

}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type', 'obsSeq', 'obsTitle', 'receievedDate', 'reportName', 'deptName', 'sentToMultipleDept', 'responseStatus'];
  displayedColumnsMob: string[] = ['select', 'obsTitle', 'receievedDate'];
  displayedColumnsSmallMob: string[] = ['select', 'obsTitle'];
  dataSource: MatTableDataSource<PeriodicElement>;
  selection = new SelectionModel<String>(true, []);
  selectedRow: PeriodicElement[] = [];
  workitems: WorkItem[] = [];
  inboxItems: InboxItem[];
  searchKey: string;
  userId: string;
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  typeData = new FormControl();
  typeList: string[] = ['All'];
  isTypeFirst: any = true;
  sequenceData = new FormControl();
  sequenceList: string[] = ['All'];
  isSequenceFirst: any = true;
  departmentData = new FormControl();
  departmentList: string[] = ['All'];
  isDepartmentFirst: any = true;
  statusData = new FormControl();
  statusList: string[] = ['All'];
  isStatusFirst: any = true;
  userJobTitle: string;
  departmentCode: string;
  isRtl: any;
  selectedDelegateUserInfo: any;
  // isDialogLoading: boolean;
  isAdmin: boolean = false;
  userInformation: any;
  inboxInterval: any;
  isAssignToDepartmentAvailable: boolean = false;
  pageIndex: string | null;
  isApproveEnable: boolean = false;
  isAssignToStaffEnable: boolean = false;
  isSbResponseType: boolean = false;
  obsId: any;
  id: string;
  deptCycleId: any;
  innerWidth = 0;
  isCalled = false;
  multipleData = new FormControl();
  multipleList: string[] = ['All'];
  isMultipleFirst: any = true;
  isReviewEnabled= false;
  isReviewButtonEnabled= false;
  isReviewedFirst: any = true;
  reviewedList: string[] = ['All'];
  reviewedData = new FormControl();
  constructor(
    private coreService: CoreService,
    private router: Router,
    public dialog: MatDialog,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private notification: NzNotificationService

  ) { }

  ngOnInit(): void {
    this.pageIndex = localStorage.getItem('sabPaginatorInboxIndex');
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
          this.getInboxWorkItems();
          this.isCalled = true;
        }


      }
    });

    this.sharedVariableService.getUserInfoAvailable().subscribe((value) => {
      if (value) {
        console.log(value, "value getUserInfoAvailable")
        let userData: any = localStorage.getItem('sabUserInformation');
        this.userInformation = JSON.parse(userData);
        console.log(this.userInformation)
        this.userId = this.userInformation.sabMember.loginId;
        this.userJobTitle = this.userInformation.sabMember.userJobTitle;
        this.departmentCode = localStorage.getItem('departmentCode') || '';
        this.isAdmin = this.userInformation.admin;
        if (this.userInformation.canReviewObservations) {
          this.isReviewEnabled= true;
          this.displayedColumns.push('reviewed')
        }
        if (!this.isCalled) {
          this.getInboxWorkItems();
          this.isCalled = true;
        }
        this.inboxInterval = setInterval(() => this.checkInboxWorkItems(), 60000);
      }

    });

    this.innerWidth = window.innerWidth;
    // this.userId ="ECMTest_HR_Eng";    
  }

  ngOnDestroy() {
    clearInterval(this.inboxInterval);
  }

  getInboxWorkItems() {
    this.typeData = new FormControl();
    let oldTypeList = this.typeList;
    this.typeList = ['All'];
    this.isTypeFirst = true;
    this.sequenceData = new FormControl();
    let oldSequenceList = this.sequenceList;
    this.sequenceList = ['All'];
    this.isSequenceFirst = true;
    this.departmentData = new FormControl();
    let oldDepartmentList = this.departmentList;
    this.departmentList = ['All'];
    this.isDepartmentFirst = true;
    this.statusData = new FormControl();
    let oldStatusList = this.statusList;
    this.statusList = ['All'];
    this.isStatusFirst = true;
    this.multipleData = new FormControl();
    this.multipleList = ['All'];
    this.reviewedData = new FormControl();
    this.reviewedList = ['All'];
    this.isMultipleFirst = true;
    this.isReviewedFirst = true;
    console.log("getInboxWorkItems")
    let url = 'inboxController/getInboxWorkItems?isAdmin=' + this.isAdmin + '&userLogin=' + this.userId
    if (this.selectedDelegateUserInfo) {
      url = url + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&behalfUserTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&behalfUserDeptCode=' + this.selectedDelegateUserInfo.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&behalfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle + '&behalfUserDeptCode=' + this.userInformation.supervisorDetails.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
    
      this.isLoading = false;
      this._loading.setLoading(false, url);
      let filterType = localStorage.getItem('sabFilterType');
      let filterSequence = localStorage.getItem('sabFilterSequence');
      let filterDepartment = localStorage.getItem('sabFilterDepartment');
      let filterStatus = localStorage.getItem('sabFilterStatus');
      let filterMultipleDept = localStorage.getItem('sabResponseProgressFilterMultipleDept');
      let filterReviewed = localStorage.getItem('sabFilterReviewed');
      let isFilterSelected = false;

      this.sharedVariableService.setValue(response.length);
      // response.map((data: any) => {
      for (let i = 0; i < response.length; i++) {
        let recDate = response[i].receievedDate.replaceAll('/', '-');
        let time = recDate.split(' ')
        recDate  = time[0].split('-')
        let onlyDate = recDate[0]
        recDate[0] = recDate[2]
        recDate[2] = onlyDate
        recDate = recDate.join('-')
        recDate = recDate + ' ' + time[1]
        // console.log(recDate)
        // console.log('rec',response[i].receievedDate.replaceAll('/','-'))
        recDate = new Date(recDate)
        
        response[i].receievedDate = recDate
        let data = response[i];
        this.typeList.push(data.responseType);
        this.sequenceList.push(data.obsSeq);
        const department = data.deptName.split(";");
        department.map((dep: any) => {
          this.departmentList.push(dep.trim());
        });
        this.statusList.push(data.responseStatus);
        this.multipleList.push(data.sentToMultipleDept);
        this.reviewedList.push(data.reviewed);
        // data.isExpanded = true;
      }
      // )

      let typeSet = new Set(this.typeList);
      this.typeList = [...typeSet];
      if (filterType != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterType, this.typeList, [])
        this.typeData.setValue(filterValue);
      } else {
        this.typeData.setValue(this.typeList);
      }
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
      let departmentSet = new Set(this.departmentList);
      this.departmentList = [...departmentSet];
      if (filterDepartment != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterDepartment, this.departmentList, [])
        this.departmentData.setValue(filterValue);
      } else {
        this.departmentData.setValue(this.departmentList);
      }
      let statusSet = new Set(this.statusList);
      this.statusList = [...statusSet];

      this.statusList.sort();
      if (filterStatus != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterStatus, this.statusList, [])
        this.statusData.setValue(filterValue);
      } else {
        this.statusData.setValue(this.statusList);
      }
      let multipleSet = new Set(this.multipleList);
      this.multipleList = [...multipleSet];
      this.multipleList.sort();
      if (filterMultipleDept != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterMultipleDept, this.multipleList, [])
        this.multipleData.setValue(filterValue);
      } else {
        this.multipleData.setValue(this.multipleList);
      }


      let reviewedSet = new Set(this.reviewedList);
      this.reviewedList = [...reviewedSet];
      this.reviewedList.sort();
      if (filterReviewed != null) {
        isFilterSelected = true;
        let filterValue = await this.applyOldFilter(filterReviewed, this.reviewedList, [])
        this.reviewedData.setValue(filterValue);
      } else {
        this.reviewedData.setValue(this.reviewedList);
      }

      // const ids = response.map((o:any) => o.stepCustomId)
      // response = response.filter(({id}:any, index:any) => !ids.includes(id, index + 1))
      this.inboxItems = response;


      this.dataSource = new MatTableDataSource(response);
      this.dataSource.data.sort((a, b) => {
        //    switch (b) {
        //      case 'receievedDate': return new Date(b.receievedDate);
        return a.obsSeq - b.obsSeq;
        //    default: return a[b];
      });


      if (isFilterSelected) {
        this.updateDataSource();
      }
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.sort, 'srt');

        this.dataSource.paginator = this.paginator;
      })
      setTimeout(() => {
        this.isTypeFirst = false;
        this.isSequenceFirst = false;
        this.isDepartmentFirst = false;
        this.isStatusFirst = false;
        this.isMultipleFirst = false;
        this.isReviewedFirst = false;
        // this.setAnchorTagSize();
      }, 500)
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

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

  multipleChange(event: any) {
    console.log(event);

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
          localStorage.setItem('sabFilterReviewed', JSON.stringify([]));
        } else {
          this.reviewedData.setValue([]);
          localStorage.setItem('sabFilterReviewed', JSON.stringify(this.reviewedList));
        }
        this.isReviewedFirst = false;
      } else {
        this.isReviewedFirst = true;
        let filter: any = localStorage.getItem('sabFilterReviewed');

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
              localStorage.setItem('sabFilterReviewed', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabFilterReviewed', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabFilterReviewed', JSON.stringify(filter));
              if ((this.reviewedData.value.length + 1) == this.reviewedList.length) {
                this.isReviewedFirst = true;
                this.reviewedData.setValue(this.reviewedList);
                localStorage.setItem('sabFilterReviewed', JSON.stringify([]));
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

  onResize(event: any) {
    this.innerWidth = window.innerWidth;
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
      this.dataSource.data.forEach((row, i) => {
        this.dataSource.data[i].isSelected = false;
      });
    } else {
      this.dataSource.data.forEach((row: any, i) => {
        if(row?.reviewed == "yes"){
          this.isReviewButtonEnabled = false;
        }
        this.dataSource.data[i].isSelected = this.dataSource.data[i].hasOwnProperty('isSelected') ? !this.dataSource.data[i].isSelected : true;
        let stepCustomId = row.stepCustomId
        this.selection.select(stepCustomId);
        this.selectedRow.push(this.dataSource.data[i])
        let find = false;
        let isReviewedYes = false;
        let isApproveDesable = false;
        let isAssignToStaffDesable = false;
        this.isAssignToDepartmentAvailable = false;
        let callDate: any = "";
        var today: any = new Date();
        today.setHours(0, 0, 0, 0);
        // today = today.getTime();

        if (this.selectedRow.length == 1 && this.selectedRow[0].responseType == "Sb") {
          if (this.selectedRow[0].obsCategory == 'Normal' && this.selectedRow[0].stepUnqName == 'ManagerAssignStaff'
          && this.selectedRow[0].isGpaEditSentBack==false) {
            this.obsId = this.selectedRow[0].obsId;
            this.id = this.selectedRow[0].stepCustomId;
            this.deptCycleId = this.selectedRow[0].deptCycleId;
            if (this.selectedRow[0].callDate) {
              callDate = new Date(this.selectedRow[0].callDate);
              callDate.setDate(callDate.getDate());
              callDate.setHours(0, 0, 0, 0);
              // callDate = callDate.getTime();
            }
            console.log(today + " < " + callDate)
            if (today < callDate) {
              this.isAssignToStaffEnable = true;
            } else {
              if (this.isAdmin) {
                this.isAssignToStaffEnable = true;
              } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {
                // this.isAssignToStaffEnable = false;
                if (this.selectedRow[0].isGpaSentBack) {
                  let gpaSendBackDate = new Date(this.selectedRow[0].gpaSendBackDate);
                  gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                  gpaSendBackDate.setHours(0, 0, 0, 0);
                  if (today <= gpaSendBackDate) {
                    this.isAssignToStaffEnable = true;
                  } else {
                    this.isAssignToStaffEnable = false;
                  }

                } else {
                  this.isAssignToStaffEnable = false;
                }
              }
            }
            this.isSbResponseType = true;
            this.isApproveEnable = false;
          } else if (this.selectedRow[0].obsCategory == 'Normal' && (this.selectedRow[0].stepUnqName == 'ManagerApproval' || this.selectedRow[0].stepUnqName == 'NORMAL-DCEO-OR-CEO-APPROVAL')) {
            this.isApproveEnable = true;
          }
        } else {
          isApproveDesable = false;
          this.isAssignToStaffEnable = false;
          this.isSbResponseType = false;
          this.selectedRow.map((data: any) => {
            if (!(data.responseStatus == "Pending Assignment to Department" && data.responseType == "N")) {
              find = true;
              this.isAssignToDepartmentAvailable = false;
            }
            if (data.obsCategory == 'Normal' && (data.stepUnqName == 'ManagerApproval' || data.stepUnqName == 'NORMAL-DCEO-OR-CEO-APPROVAL')) {
              this.isApproveEnable = true;
            } else {
              isApproveDesable = true;
            }
            if (data.obsCategory == 'Normal' && (data.stepUnqName == 'ManagerAssignStaff' 
            && data.isGpaEditSentBack==false
              && (data.previousRole == 'G&PA' || data.previousRole == 'DCEO'))) {
              if (data.callDate) {
                callDate = new Date(data.callDate);
                callDate.setDate(callDate.getDate());
                callDate.setHours(0, 0, 0, 0);
                // callDate = callDate.getTime();
              }
              console.log(today + " < " + callDate)
              if (today < callDate) {
                this.isAssignToStaffEnable = true;
              } else {
                if (this.isAdmin) {
                  this.isAssignToStaffEnable = true;
                } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {
                  // isAssignToStaffDesable = true;
                  if (data.isGpaSentBack) {
                    let gpaSendBackDate = new Date(data.gpaSendBackDate);
                    gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                    gpaSendBackDate.setHours(0, 0, 0, 0);
                    if (today <= gpaSendBackDate) {
                      // isAssignToStaffDesable = true;
                    }
                  } else {
                    isAssignToStaffDesable = true;
                  }
                }
              }
            } else {
              isAssignToStaffDesable = true;
            }

          })
          if (!find) {
            // if(callDate == '' || today < callDate){
            this.isAssignToDepartmentAvailable = true;
            // }
          }
          if (isApproveDesable) {
            this.isApproveEnable = false;
          }
          if (isAssignToStaffDesable) {
            this.isAssignToStaffEnable = false;
          }
        }
      });
    }
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row.stepCustomId) ? 'deselect' : 'select'} row ${row.obsSeq + 1}`;
  }

  navigateTo(event: any, row: any) {
    // localStorage.setItem('sabFilterType', JSON.stringify(this.typeData.value));
    // localStorage.setItem('sabFilterSequence', JSON.stringify(this.sequenceData.value));
    // localStorage.setItem('sabFilterDepartment', JSON.stringify(this.departmentData.value));
    // localStorage.setItem('sabFilterStatus', JSON.stringify(this.statusData.value));
    if (row.responseStatus == 'Pending Combine & Complete Response' || 
    row.responseStatus == 'Pending Combine Response Update' || 
    row.responseStatus == 'Pending Combine Response') {
      let _sec = 'No';
      if (this.userJobTitle == 'SEC' && !this.isAdmin) {
        _sec = 'Yes';
      }
      let url = 'workItemController/getResponseCount?stepCustomId=' + row.stepCustomId;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        if (response > 1) {
          this.router.navigate(['inbox/combine-responses', row.stepCustomId], { queryParams: { isSecretary: _sec } });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              dialogHeader: 'INFORMATION',
              dialogMessage: 'PLEASE_WAIT'
            }
          });
        }
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });

    } else {
      let responseItems = []
      let selectedIndex = 0;
      let matched = false;
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].stepCustomId == row.stepCustomId) {
          matched = true;
        }
        if(this.dataSource.data[i].responseStatus != 'Pending Combine & Complete Response' 
        && this.dataSource.data[i].responseStatus != 'Pending Combine Response Update' && 
        this.dataSource.data[i].responseStatus != 'Pending Combine Response'){
          if(matched == false){
            selectedIndex =  selectedIndex + 1;
          }
          responseItems.push({
            stepCustomId: this.dataSource.data[i].stepCustomId,
          })
        }

        if (this.dataSource.data.length - 1 == i) {
          localStorage.setItem('inboxItems', JSON.stringify(responseItems))
          localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex))
        }
      }
     console.log('responseItems',responseItems);
      if (event?.ctrlKey && this.isAdmin) {
        let serverHost = location.href.split('/#/')
        const link = document.createElement("a");        
        link.href = `${serverHost[0]}/#/inbox/work-item-details/${row.stepCustomId}`;
        link.target = "_blank";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }else{
        this.router.navigate(['inbox/work-item-details', row.stepCustomId],{queryParams : {selectedIndex: selectedIndex}});
      }
      
    }
  }

  typeChange(event: any) {
    if (!this.isTypeFirst) {
      if (event.source.value == 'All') {
        this.isTypeFirst = true;
        if (event.source._selected) {
          this.typeData.setValue(this.typeList);
          localStorage.setItem('sabFilterType', JSON.stringify([]));
        } else {
          this.typeData.setValue([]);
          localStorage.setItem('sabFilterType', JSON.stringify(this.typeList));
        }
        this.isTypeFirst = false;
      } else {
        this.isTypeFirst = true;
        let filter: any = localStorage.getItem('sabFilterType');

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
              localStorage.setItem('sabFilterType', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabFilterType', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabFilterType', JSON.stringify(filter));
              if ((this.typeData.value.length + 1) == this.typeList.length) {
                this.isTypeFirst = true;
                this.typeData.setValue(this.typeList);
                localStorage.setItem('sabFilterType', JSON.stringify([]));
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
          localStorage.setItem('sabFilterSequence', JSON.stringify([]));
        } else {
          this.sequenceData.setValue([]);
          localStorage.setItem('sabFilterSequence', JSON.stringify(this.sequenceList));
        }
        this.isSequenceFirst = false;
      } else {
        this.isSequenceFirst = true;
        let filter: any = localStorage.getItem('sabFilterSequence');

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
              localStorage.setItem('sabFilterSequence', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabFilterSequence', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabFilterSequence', JSON.stringify(filter));
              if ((this.sequenceData.value.length + 1) == this.sequenceList.length) {
                this.isSequenceFirst = true;
                this.sequenceData.setValue(this.sequenceList);
                localStorage.setItem('sabFilterSequence', JSON.stringify([]));
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
          localStorage.setItem('sabFilterDepartment', JSON.stringify([]));
        } else {
          this.departmentData.setValue([]);
          localStorage.setItem('sabFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabFilterDepartment');

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
              localStorage.setItem('sabFilterDepartment', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabFilterDepartment', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabFilterDepartment', JSON.stringify(filter));
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabFilterDepartment', JSON.stringify([]));
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
          localStorage.setItem('sabFilterStatus', JSON.stringify([]));
        } else {
          this.statusData.setValue([]);
          localStorage.setItem('sabFilterStatus', JSON.stringify(this.statusList));
        }
        this.isStatusFirst = false;
      } else {
        this.isStatusFirst = true;
        let filter: any = localStorage.getItem('sabFilterStatus');

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
              localStorage.setItem('sabFilterStatus', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabFilterStatus', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabFilterStatus', JSON.stringify(filter));
              if ((this.statusData.value.length + 1) == this.statusList.length) {
                this.isStatusFirst = true;
                this.statusData.setValue(this.statusList);
                localStorage.setItem('sabFilterStatus', JSON.stringify([]));
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

  updateDataSource() {
    setTimeout(() => {
      let type: any[] = [];
      let sequence: any[] = [];
      let department: any[] = [];
      let status: any[] = [];
      let multipleDept: any[] = [];
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
        type.map(data => {
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
      this.multipleData.value.map((multipleDeptData: any) => {
        status.map(data => {
          // console.log(data);

          if (multipleDeptData != 'All') {
            if (multipleDeptData == data.sentToMultipleDept) {
              multipleDept.push(data);
            }
          }

        })
      })
      this.reviewedData.value.map((reviewedData: any) => {
        multipleDept.map(data => {
          if (reviewedData != 'All') {
            if (reviewedData == data.reviewed) {
              reviewed.push(data);
            }
          }
        })
      })
      this.dataSource.data = reviewed
      this.dataSource.data.sort((a, b) => {
        return a.obsSeq - b.obsSeq;
      });
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, 300)
  }

  onAssignToDept(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getDepartments?userId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + "&r=" + (Math.floor(Math.random() * 100) + 100);
    } else {

      if (this.userJobTitle == 'SEC') {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let _result = {
        "directoratesList": response,
        "noOfActiveDepts": 0
      }
      const dialogRef = this.dialog.open(DepartmentAssignmentComponent, {
        data: _result
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.event == 'Send') {
          var stepIds: Array<string> = [];
          this.selectedRow.map(data => {
            stepIds.push(data.stepCustomId);
          })

          var assignToDeptData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            managers: result.data.selectedManagers,
            userId: this.userId,
            userJobTitle: this.userJobTitle,
          }
          this.assignToDeptartment(assignToDeptData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  assignToDeptartment(result: any): void {
    // this.isDialogLoading = true;
    let url = 'AssigmentsController/assignToDepartments';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];
      this.getInboxWorkItems();
    }, error => {

      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  checkInboxWorkItems() {
    // this.dataSource = new MatTableDataSource();
    // this.selection.clear()
    // localStorage.setItem('sabFilterType', JSON.stringify(this.typeData.value));
    // localStorage.setItem('sabFilterSequence', JSON.stringify(this.sequenceData.value));
    // localStorage.setItem('sabFilterDepartment', JSON.stringify(this.departmentData.value));
    // localStorage.setItem('sabFilterStatus', JSON.stringify(this.statusData.value));
    console.log("checkInboxWorkItems")
    let url = 'inboxController/getInboxWorkItems?isAdmin=' + this.isAdmin + '&userLogin='
    if (this.selectedDelegateUserInfo) {
      url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&behalfUserTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&behalfUserDeptCode=' + this.selectedDelegateUserInfo.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&behalfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle + '&behalfUserDeptCode=' + this.userInformation.supervisorDetails.departmentCode + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.userId + '&userJobTitle=' + this.userJobTitle + '&departmentCode=' + this.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    // this.isLoading = true;
    this.coreService.get(url).subscribe(async response => {
      if (!_.isEqual(JSON.stringify(response), JSON.stringify(this.inboxItems))) {
        this.typeData = new FormControl();
        let oldTypeList = this.typeList;
        this.typeList = ['All'];
        this.isTypeFirst = true;
        this.sequenceData = new FormControl();
        let oldSequenceList = this.sequenceList;
        this.sequenceList = ['All'];
        this.isSequenceFirst = true;
        this.departmentData = new FormControl();
        let oldDepartmentList = this.departmentList;
        this.departmentList = ['All'];
        this.isDepartmentFirst = true;
        this.statusData = new FormControl();
        let oldStatusList = this.statusList;
        this.statusList = ['All'];
        this.isStatusFirst = true;
        let oldMultipleDept = this.multipleList;
        this.multipleList = ['All'];
        this.isMultipleFirst = true;

        let oldReviewed = this.reviewedList;
        this.reviewedList = ['All'];
        this.isReviewedFirst = true;
        let filterType = localStorage.getItem('sabFilterType');
        let filterSequence = localStorage.getItem('sabFilterSequence');
        let filterDepartment = localStorage.getItem('sabFilterDepartment');
        let filterStatus = localStorage.getItem('sabFilterStatus');
        let isFilterSelected = false;
        this.sharedVariableService.setValue(response.length);
        response.map((data: any, i :any) => {
          this.reviewedList.push(data.reviewed);
          let recDate = response[i].receievedDate.replaceAll('/', '-');
          let time = recDate.split(' ')
          recDate  = time[0].split('-')
          let onlyDate = recDate[0]
          recDate[0] = recDate[2]
          recDate[2] = onlyDate
          recDate = recDate.join('-')
          recDate = recDate + ' ' + time[1]
          recDate = new Date(recDate)
        
        response[i].receievedDate = recDate
          this.typeList.push(data.responseType);
          let changedSelected = this.dataSource.data.filter(item => { return data.stepCustomId == item.stepCustomId });

          if (changedSelected.length > 0) {
            data['isSelected'] = changedSelected[0].hasOwnProperty('isSelected') ? changedSelected[0].isSelected : false
          }
          this.sequenceList.push(data.obsSeq);
          const department = data.deptName.split(";");
          department.map((dep: any) => {
            this.departmentList.push(dep.trim());
          });
          this.statusList.push(data.responseStatus);
          this.multipleList.push(data.sentToMultipleDept)
          this.multipleList.push(data.reviewed)
          //data.isExpanded = true;
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
        let sequenceSet = new Set(this.sequenceList);
        this.sequenceList = [...sequenceSet];
        if (filterSequence != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterSequence, this.sequenceList, oldSequenceList)
          this.sequenceData.setValue(filterValue);
        } else {
          this.sequenceData.setValue(this.sequenceList);
        }
        let departmentSet = new Set(this.departmentList);
        this.departmentList = [...departmentSet];
        if (filterDepartment != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterDepartment, this.departmentList, oldDepartmentList)
          this.departmentData.setValue(filterValue);
        } else {
          this.departmentData.setValue(this.departmentList);
        }
        let statusSet = new Set(this.statusList);
        this.statusList = [...statusSet];
        this.statusList.sort();
        if (filterStatus != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterStatus, this.statusList, oldStatusList,)
          this.statusData.setValue(filterValue);
        } else {
          this.statusData.setValue(this.statusList);
        }
        let multipleDeptSet = new Set(this.multipleList);
        this.multipleList = [...multipleDeptSet];
        this.multipleList.sort();
        if (filterStatus != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterStatus, this.multipleList, oldMultipleDept)
          this.multipleData.setValue(filterValue);
        } else {
          this.multipleData.setValue(this.multipleList);
        }


        let reviewedSet = new Set(this.reviewedList);
        this.reviewedList = [...reviewedSet];
        this.reviewedList.sort();
        if (filterStatus != null) {
          isFilterSelected = true;
          let filterValue = await this.applyOldFilter(filterStatus, this.reviewedList, oldReviewed)
          this.reviewedData.setValue(filterValue);
        } else {
          this.reviewedData.setValue(this.reviewedList);
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
        })
        setTimeout(() => {
          this.isTypeFirst = false;
          this.isSequenceFirst = false;
          this.isDepartmentFirst = false;
          this.isStatusFirst = false;
          this.isReviewedFirst = false;
          // this.setAnchorTagSize();
        }, 500)
      }
    }, error => {
      // this.isLoading = false;
      console.log('error :', error);
    });
  }

  // setAnchorTagSize(){
  //   console.log("inside setAnchor")
  //   let elementTD = document.getElementsByClassName('mat-row');
  //   console.log(elementTD)
  //    for(let i = 0;i < elementTD.length;i++){
  //        $('.anchor-tag-'+i).css('height',elementTD[i].clientHeight+'px')
  //     }
  // }
  selectionChange(data: any, row: any) {
    let find = false;
    let isApproveDesable = false;
    let isAssignToStaffDesable = false;
    this.isAssignToDepartmentAvailable = false;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].stepCustomId == row.stepCustomId) {
        this.dataSource.data[i].isSelected = this.dataSource.data[i].hasOwnProperty('isSelected') ? !this.dataSource.data[i].isSelected : true;
        if (this.dataSource.data[i].isSelected) {
          this.selectedRow.push(this.dataSource.data[i])
        } else {
          for (let j = 0; j < this.selectedRow.length; j++) {
            if (this.selectedRow[j].stepCustomId == this.dataSource.data[i].stepCustomId) {
              this.selectedRow.splice(j, 1);
              break;
            }
          }

        }
      }
    }
    this.isReviewButtonEnabled = true;
    this.selectedRow.forEach((row: any)=>{
      if(row?.reviewed == "yes"){
        this.isReviewButtonEnabled = false;
      }
    })    

    let callDate: any = "";
    var today: any = new Date();
    today.setHours(0, 0, 0, 0);
    // today = today.getTime();

    if (this.selectedRow.length == 1 && this.selectedRow[0].responseType == "Sb") {
      if (this.selectedRow[0].obsCategory == 'Normal' && this.selectedRow[0].stepUnqName == 'ManagerAssignStaff'
      ) {
        this.isApproveEnable = false;
        if(this.selectedRow[0].isGpaEditSentBack==false){
        this.obsId = this.selectedRow[0].obsId;
        this.id = this.selectedRow[0].stepCustomId;
        this.deptCycleId = this.selectedRow[0].deptCycleId;
        if (this.selectedRow[0].callDate) {
          callDate = new Date(this.selectedRow[0].callDate);
          callDate.setDate(callDate.getDate());
          callDate.setHours(0, 0, 0, 0);
          // callDate = callDate.getTime();
        }
        console.log(today + " < " + callDate)
        if (today < callDate) {
          this.isAssignToStaffEnable = true;
        } else {
          if (this.isAdmin) {
            this.isAssignToStaffEnable = true;
          } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {

            if (this.selectedRow[0].isGpaSentBack) {

              let gpaSendBackDate = new Date(this.selectedRow[0].gpaSendBackDate);
              gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
              gpaSendBackDate.setHours(0, 0, 0, 0);
              if (today <= gpaSendBackDate) {
                this.isAssignToStaffEnable = true;
              } else {
                this.isAssignToStaffEnable = false;
              }
            } else {
              this.isAssignToStaffEnable = false;
            }
            // this.isAssignToStaffEnable = false;

          }
        }
        this.isSbResponseType = true;
        this.isApproveEnable = false;
      }
      } else if (this.selectedRow[0].obsCategory == 'Normal' && (this.selectedRow[0].stepUnqName == 'ManagerApproval' || this.selectedRow[0].stepUnqName == 'NORMAL-DCEO-OR-CEO-APPROVAL')) {
        this.isApproveEnable = true;
      }
    } else {
      isApproveDesable = false;
      this.isAssignToStaffEnable = false;
      this.isSbResponseType = false;
      this.selectedRow.map(data => {
        if (!(data.responseStatus == "Pending Assignment to Department" && data.responseType == "N")) {
          find = true;
          this.isAssignToDepartmentAvailable = false;
        }
        if (data.obsCategory == 'Normal' && (data.stepUnqName == 'ManagerApproval' || data.stepUnqName == 'NORMAL-DCEO-OR-CEO-APPROVAL')) {
          this.isApproveEnable = true;
        } else {
          isApproveDesable = true;
        }
        if (data.obsCategory == 'Normal' && (data.stepUnqName == 'ManagerAssignStaff' 
        && data.isGpaEditSentBack==false
          && (data.previousRole == 'G&PA' || data.previousRole == 'DCEO'))) {
          if (data.callDate) {
            callDate = new Date(data.callDate);
            callDate.setDate(callDate.getDate());
            callDate.setHours(0, 0, 0, 0);
            // callDate = callDate.getTime();
          }
          console.log(today + " < " + callDate)
          if (today < callDate) {
            this.isAssignToStaffEnable = true;
          } else {
            if (this.isAdmin) {
              this.isAssignToStaffEnable = true;
            } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {
              // isAssignToStaffDesable = true;

              if (data.isGpaSentBack) {
                let gpaSendBackDate = new Date(data.gpaSendBackDate);
                gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                gpaSendBackDate.setHours(0, 0, 0, 0);
                if (today <= gpaSendBackDate) {
                  // isAssignToStaffDesable = true;
                } else {
                  isAssignToStaffDesable = true;
                }
              } else {
                isAssignToStaffDesable = true;
              }
            }
          }
        } else {
          isAssignToStaffDesable = true;
        }

      })
      if (!find) {
        // if(callDate == '' || today < callDate){
        this.isAssignToDepartmentAvailable = true;
        // }
      }
      if (isApproveDesable) {
        this.isApproveEnable = false;
      }
      if (isAssignToStaffDesable) {
        this.isAssignToStaffEnable = false;
      }
    }
  }

  onPaginateChange(event: any) {
    this.pageIndex = event.pageIndex;
    localStorage.setItem('sabPaginatorInboxIndex', JSON.stringify(this.pageIndex));
  }

  onApprove(): void {
    let url = 'workItemController/bulkApproval';
    this._loading.setLoading(true, url);
    var stepIds: Array<string> = [];
    this.selectedRow.map(data => {
      stepIds.push(data.stepCustomId);
    })
    let onBhalfOf;
    let isDelegatedUser = false;
    if (this.selectedDelegateUserInfo) {
      onBhalfOf = this.selectedDelegateUserInfo.loginId;
      isDelegatedUser = true;
    } else if (this.userJobTitle == 'SEC') {
      onBhalfOf = this.userInformation.supervisorDetails.loginId;
    }
    var data = {
      stepCustomIds: stepIds,
      userJobTitle: this.userJobTitle,
      onBhalfOf: onBhalfOf,
      userId: this.userId,
      stepUnqName: 'ManagerApproval',
      delegatedUser: isDelegatedUser
    }


    this.coreService.post(url, data).subscribe(response => {
      this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];
      this.getInboxWorkItems();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onAssignToStaff(): void {
    let url = 'UserController/getStaffMembers?';
    if (this.isSbResponseType) {
      url = url + 'obsId=' + this.obsId + '&stepCustomId=' + this.id + '&deptCycleId=' + this.deptCycleId + '&operationType=Assign&userId=';
      if (this.selectedDelegateUserInfo) {
        url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        if (this.userJobTitle == 'SEC') {
          url = url + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        } else {
          url = url + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        }

      }
    } else {
      if (this.selectedDelegateUserInfo) {
        url = url + 'operationType=Assign&userId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        if (this.userJobTitle == 'SEC') {
          url = url + 'operationType=Assign&userId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        } else {
          url = url + 'operationType=Assign&userId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        }

      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      var _input = {
        departmentData: response,
        dialougeType: 'ASSIGN_STAFF',
        activeParticipants: response.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToStaffComponent, {
        width: '800px',
        data: _input
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.event == 'Send') {
          let _onBehalf = this.userInformation.sabMember.loginId;
          let isDelegatedUser = false;
          if (this.selectedDelegateUserInfo) {
            _onBehalf = this.selectedDelegateUserInfo.loginId;
            isDelegatedUser = true;
          } else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          var stepIds: Array<string> = [];
          this.selectedRow.map(data => {
            stepIds.push(data.stepCustomId);
          })
          var assignToStaffData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            staffMemebers: result.data.selectedStaff,
            userId: this.userId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToStaff(assignToStaffData);
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  sendToStaff(result: any): void {
    let url = 'AssigmentsController/assignToStaff';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];
      this.getInboxWorkItems();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
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
    this.coreService.get(url).subscribe(response => {
      this.notification.create(
        'success',
        'Success',
        'G&PA TL review status updated successfully'
      );
      this._loading.setLoading(false, url);
      this.selection.clear();
      this.selectedRow = [];
      this.getInboxWorkItems();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, row: any) {
    event.preventDefault();
    return;
    if(this.isAdmin){
      if (row.responseStatus == 'Pending Combine & Complete Response' || row.responseStatus == 'Pending Combine Response Update' || row.responseStatus == 'Pending Combine Response') {
      }else{    
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'item': row };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
      }
    }
  }

  onContextMenuAction1(row: any) {
    let serverHost = location.href.split('/#/')
    console.log(serverHost[0]);
    if (row.responseStatus == 'Pending Combine & Complete Response' || row.responseStatus == 'Pending Combine Response Update' || row.responseStatus == 'Pending Combine Response') {
      let _sec = 'No';
      if (this.userJobTitle == 'SEC' && !this.userInformation.isAdmin) {
        _sec = 'Yes';
      }
      let url = 'workItemController/getResponseCount?stepCustomId=' + row.stepCustomId;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        if (response > 1) {
          //  this.router.navigate(['inbox/combine-responses', row.stepCustomId],{ queryParams: { : _sec}});
          let url = `${serverHost[0]}/#/inbox/combine-responses/${row.stepCustomId}?isSecretary=${_sec}`
          
          if(this.selectedDelegateUserInfo){
            url = url + '&isDelegated=true';
          }else if(this.userJobTitle == 'SEC'){
            url = url + '&isSec=true';
          }
          window.open(url);
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              dialogHeader: 'INFORMATION',
              dialogMessage: 'PLEASE_WAIT'
            }
          });
        }
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });

    } else {
      let url = `${serverHost[0]}/#/inbox/work-item-details/${row.stepCustomId}`
     // if(this.selectedDelegateUserInfo){
     //   url = url + '?isDelegated=true';
    //  }else if(this.userJobTitle == 'SEC'){
    //    url = url + '?isSec=true';
     // }
      window.open(url);
    }
  }
}
