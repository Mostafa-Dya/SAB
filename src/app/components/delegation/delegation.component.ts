import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EditDelegationDialogComponent } from './edit-delegation-dialog/edit-delegation-dialog.component';

export interface Users {
  loginId: number;
  userName: string;
  directorateName: string;
  department: string;
  designation: string;
}

export interface DelegatedUsers {
  id: number;
  fromLoginId: string;
  toLoginId: string;
  fromUserName: string;
  toUserName: string;
  delegationFrom: string;
  delegationTo: string;
  delegateFrom: string;
  active: boolean;
  deleted: boolean;
  delegationReason: string;
  createDate: string;
  addedByUserName: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class DelegationComponent implements OnInit {
  isRtl: any;
  addDelegateUserForm: FormGroup;
  addToDelegateForm: FormGroup;
  users: any[] = [];
  // users: Users[] = [];
  isLoading: boolean = false;
  minDate = new Date();
  minToDate = new Date();
  minForToDate = new Date();
  isToDisable = true;
  dataSource: MatTableDataSource<DelegatedUsers>;
  dataSourceDelegate: MatTableDataSource<DelegatedUsers>;
  displayedColumns: string[] = ['delegateFrom', 'user', 'from', 'to', 'reason', 'addedBy', 'action'];
  displayedColumnsMob: string[] = ['delegateFrom'];
  displayedColumns1: string[] = ['userName', 'delegateFrom', 'user', 'from', 'to', 'reason', 'addedBy', 'action'];
  userInformation: any;
  loginId: any;
  userName: any;
  userControl = new FormControl();
  filteredUser: Observable<any[]>;
  userJobTitle: any;
  router: any;
  Users: any[] = [];
  isButtonDisabled: boolean = true;
  msg: any = '';
  filteredUserData: Observable<any[]>;
  filteredDelegateData: Observable<any[]>;
  userData = new FormControl();
  delegateUserData = new FormControl();
  filtered: any = [];
  allTo: any = [];
  selectedUsers: any = [];
  selectedDelegate: any = [];
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('delegateInput') delegateInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;
  usersData: any[] = [];
  usersDelegate: any[] = [];
  isAdmin: boolean = true;
  get userDataControl() { return <FormControl>this.addToDelegateForm.get('userData') }
  get delegateUserDataControl() { return <FormControl>this.addToDelegateForm.get('delegateUserData') }
  isDisable = true;
  selectedTab = "self";
  innerWidth = 0;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _loading: LoadingService,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.allTo = this.userInformation;
    this.loginId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.isAdmin = this.userInformation.admin;
    this.minToDate.setDate(this.minToDate.getDate() + 1);
    this.minForToDate.setDate(this.minForToDate.getDate() + 1);
    this.addDelegateUserForm = this.fb.group({
      // user: [null, [Validators.required]],
      delegateUser: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, Validators.required],
      reason: [null],
    });
    this.addToDelegateForm = this.fb.group({
      userData: [null, [Validators.required]],
      delegateUserData: [{ value: null, disabled: this.isDisable }, [Validators.required]],
      // delegateUserData: [null,[Validators.required]],
      from: [null, [Validators.required]],
      to: [null, Validators.required],
      reason: [null],
    });

    // this.addToDelegateForm.valueChanges.subscribe(value => {
    //   const fromDateTime = new Date(value.from).getTime();
    //   const toDateTime = new Date(value.to).getTime();
    //   this.isButtonDisabled = fromDateTime > toDateTime;
    //   if(this.isButtonDisabled ) {
    //     this.msg = " should be greater than "
    //   }else {
    //     this.isButtonDisabled = false;
    //     this.msg = ''
    //     console.log(this.msg );
    //   }
    // });


    let activeTab = localStorage.getItem("delegationTab");
    if (activeTab) {
      if (activeTab == "self") {
        this.selectedTab = "self";
        this.getSelfDelegatedUser();
      } else {
        this.selectedTab = "others";
        this.getOthersDelegatedUser();
      }
    }

    if (!this.isAdmin) {
      this.getDelegateToData(false);
    }

    if (!this.isAdmin) {
      this.getSelfDelegatedUser();
    } else {
      this.getOthersDelegatedUser();
    }
    this.innerWidth = window.innerWidth;

  }

  changeTo() {
    if(this.addDelegateUserForm.value.to) {
      const fromDateTime =  new Date(this.addDelegateUserForm.value.from).getTime();
      const toDateTime = new Date(this.addDelegateUserForm.value.to).getTime();
      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled && toDateTime !== 0) {
        this.msg = " should be greater than or equal to "
      }
      else {
        this.isButtonDisabled = false;
        this.msg = ''
      }

    }
    if(this.addDelegateUserForm.value.to == null) {
      this.msg = ''
  }

    else if(this.addToDelegateForm.value.to) {
      const fromDateTime =  new Date(this.addToDelegateForm.value.from).getTime();
      const toDateTime = new Date(this.addToDelegateForm.value.to).getTime();
      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled && toDateTime !== 0) {
        this.msg = " should be greater than or equal to "
      }
      else {
        this.isButtonDisabled = false;
        this.msg = ''
      }
    }
    if(this.addToDelegateForm.value.to == null) {
      this.msg = ''
  }
}

  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  displayFn(user: Users): string {
    return user && user.userName ? user.userName : '';
  }

  displayUserFn(users: Users): string {
    let userDetails = users && users.userName ? users.userName : '';
    let userLoginId = users && users.loginId ? users.loginId : '';
    if (userDetails !== '' && userLoginId !== '') {
      let displayedString = userDetails + ' (' + userLoginId + ')'
      return userDetails + ' (' + userLoginId + ')';
    } else {
      return '';
    }
  }

  private _filter(name: string): Users[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(option => option.userName.toLowerCase().indexOf(filterValue) >= 0 || option.loginId.toLowerCase().indexOf(filterValue) >= 0);
  }

  private _filterUser(name: string): Users[] {
    if (this.isAdmin && name.trim().length >= 3) {
      let url = 'getAvailableDelegationUsersForGNPAList?userLogin=' + this.addToDelegateForm.controls['userData'].value;

      this.coreService.get(url).pipe(tap((response: any) => {
        this.filteredUserData = response
          .map((res: any) => res)

        return this.filteredUserData;
      })
      );
    }
    if (!this.isAdmin) {
      const filterValue = name.toLowerCase();
      return this.usersData.filter(option => option.userName.toLowerCase().indexOf(filterValue) >= 0 || option.loginId.toLowerCase().indexOf(filterValue) >= 0);
    }
    return [];
  }

  private _filterDelegate(name: string): Users[] {
    const filterValue = name.toLowerCase();
    return this.usersDelegate.filter(option => option.userName.toLowerCase().indexOf(filterValue) >= 0 || option.loginId.toLowerCase().indexOf(filterValue) >= 0);
  }

  getDelegateToData(isForOthers: boolean) {
    this.isLoading = true;

    let url = 'UserController/';

    if (this.userJobTitle == 'SEC') {
      url = url + 'getDelegationUsersList?currentUserId=' + this.userInformation.supervisorDetails.loginId + '&&isForOthers=' + isForOthers;
    } else {
      url = url + 'getDelegationUsersList?currentUserId=' + this.loginId + '&&isForOthers=' + isForOthers;;
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.users = response;
      this.usersData = response;
      this.filteredUser = this.addDelegateUserForm.controls['delegateUser'].valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice()));

      this.filteredUserData = this.addToDelegateForm.controls['userData'].valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterUser(name) : this.isAdmin ? [] : this.usersData.slice())
      );
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getUserDataForAdmin(value: any) {
    console.log(this.addToDelegateForm.controls['userData'].value);
    
    let key = this.addToDelegateForm.controls['userData'].value;
    if (this.isAdmin && typeof key != "object" && key.trim().length >= 3) {
      let url = 'UserController/';
      url = url + 'getAvailableDelegationUsersForGNPAList?userLogin=' + this.addToDelegateForm.controls['userData'].value;
      this.filteredUserData = this.coreService.get(url);
    }
  }

  checkFromUser(value: any) {
    if (value.value == '') {
      this.filteredDelegateData = of([]);
      this.delegateUserDataControl.disable();
      this.isDisable = !this.isDisable;
      this.addToDelegateForm.controls.delegateUserData.reset();
    } else {
      let key = this.addToDelegateForm.controls['userData'].value;
      if (value != key.userName) {
        this.filteredDelegateData = of([]);
        this.delegateUserDataControl.disable();
        this.isDisable = !this.isDisable;
        this.addToDelegateForm.controls.delegateUserData.reset();
      }
    }
  }
  getUserData() {
    if (!this.isAdmin) {
      this.isLoading = true;
    }
    let url = 'UserController/';
    if (this.isAdmin) {
      url = url + 'getAvailableDelegationUsersForGNPAList?userLogin=' + this.addToDelegateForm.controls['userData'].value;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + 'getAvailableDelegationUsersList?currentUserId=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url = url + 'getAvailableDelegationUsersList?currentUserId=' + this.loginId;
      }
    }
    if (!this.isAdmin) {
      this._loading.setLoading(true, url);
    }
    this.coreService.get(url).subscribe(response => {
      if (!this.isAdmin) {
        this.isLoading = false;
        this._loading.setLoading(false, url);
      }
      this.usersData = response;
      if (this.isAdmin) {
        this.filteredUserData = response
      }

    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getSelfDelegatedUser() {
    // let url = 'UserController/getDelegationListByUser?currentUserId=' + this.loginId;

    let url = 'UserController/';

    if (this.userJobTitle == 'SEC') {
      url = url + 'getDelegationListByUser?currentUserId=' + this.userInformation.supervisorDetails.loginId;
    } else {
      url = url + 'getDelegationListByUser?currentUserId=' + this.loginId;
    }
    this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
    //  response = [{ "id": 6, "fromLoginId": "ECMTEST_TL_CP_PLANS", "toLoginId": "ECMTEST_USER3", "delegationFrom": "2023-04-27", "delegationTo": "2023-04-30", "fromUserName": "Team Lead Plans Coordination", "toUserName": "ECMTest User3", "active": true, "deleted": false, "delegationReason": "AAAA", "createDate": "2023-04-27 12:34:16.29", "toJobTitle": "SENG", "fromJobTitle": "TL", "addedByLoginId": "ECMTEST_MGR_CP", "addedByUserName": "CPD Manager" }]
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.dataSource = new MatTableDataSource(response);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getOthersDelegatedUser() {
    let url = 'UserController/';
    if (this.isAdmin) {
      url = url + 'getDelegationListByGNPA';
    } else {

      // url = url + 'getDelegationListByAddedByUser?currentUserId=' + this.loginId;

      // let url = 'UserController/' ;

      if (this.userJobTitle == 'SEC') {
        url = url + 'getDelegationListByAddedByUser?currentUserId=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url = url + 'getDelegationListByAddedByUser?currentUserId=' + this.loginId;
      }
    }
    this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // response=[{"id":14,"fromLoginId":"ECMTEST_TL_CP_PERF","toLoginId":"ECMTEST_TL_CP_PROJECTS","delegationFrom":"2023-05-11","delegationTo":"2023-05-16","fromUserName":"Team Lead Performance Analysis","toUserName":"Team Lead Projects Planning","active":true,"deleted":false,"delegationReason":"A/TL","createDate":"2023-05-03 12:35:26.65","toJobTitle":"TL","fromJobTitle":"TL","addedByLoginId":"ECMTEST_MGR_CP","addedByUserName":"CPD Manager"}]
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.dataSource = new MatTableDataSource(response);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  onTabChange(tab: any) {
    if (tab.index == 0) {
      this.selectedTab = "self";
      localStorage.setItem('delegationTab', "self")
      this.getDelegateToData(false);
      this.getSelfDelegatedUser();
    } else {
      this.selectedTab = "others";
      localStorage.setItem('delegationTab', "others")
      this.getDelegateToData(true);
      this.getOthersDelegatedUser();
    }
  }

  changeFrom(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.minToDate = event.value;
      this.isToDisable = false;
    } else {
      this.isToDisable = true;
    }
    if(this.addDelegateUserForm.value.from ) {
      const fromDateTime =  new Date(this.addDelegateUserForm.value.from).getTime();
      const toDateTime = new Date(this.addDelegateUserForm.value.to).getTime();
      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled && toDateTime !== 0) {
        this.msg = " should be greater than or equal to  "
      }else {
        this.isButtonDisabled = false;
        this.msg = ''
      }
    }    else if(this.addToDelegateForm.value.from) {
      const fromDateTime =  new Date(this.addToDelegateForm.value.from).getTime();
      const toDateTime = new Date(this.addToDelegateForm.value.to).getTime();
      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled && toDateTime !== 0) {
        this.msg = " should be greater than or equal to "
      }else {
        this.isButtonDisabled = false;
        this.msg = ''
      }
    }
    }
  
  

  public errorHandling = (control: string, error: string) => {
    return this.addDelegateUserForm.controls[control].hasError(error);
  }

  addDelegateUser() {
    if (this.addDelegateUserForm.status == "INVALID") {
      return;
    } else {
      var ToDate = new Date(this.addDelegateUserForm.value.to);
      var FromDate = new Date(this.addDelegateUserForm.value.from);
      ToDate.setUTCDate(ToDate.getUTCDate() + 1);
      FromDate.setUTCDate(FromDate.getUTCDate() + 1);
      let delegateData = {
        // fromLoginId: this.addDelegateUserForm.value.delegateUser.loginId,
        // addedUserName:  this.userJobTitle == 'SEC' ? `${this.userName} on behalf of ${this.userInformation.supervisorDetails.loginId}` : this.userName,
        // addedLoginId: this.loginId,
        // // onBehalfOf:this.userJobTitle == 'SEC' ? this.addDelegateUserForm.value.delegateUser.loginId : '', 
        // toLoginId: this.addDelegateUserForm.value.delegateUser.loginId,
        // delegateFrom: moment(new Date(this.addDelegateUserForm.value.from).toString()).format('DD/MM/YYYY'),
        // delegateTo: moment(new Date(this.addDelegateUserForm.value.to).toString()).format('DD/MM/YYYY'),
        // fromUserName: this.addDelegateUserForm.value.delegateUser.userName,
        // toUserName: this.addDelegateUserForm.value.delegateUser.userName,
        // delegateReason: this.addDelegateUserForm.value.reason,
        // toJobTitle: this.addDelegateUserForm.value.delegateUser.designation,
        // fromJobTitle: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.userJobTitle  : this.userJobTitle



        fromLoginId: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.loginId : this.loginId,
        addedUserName: this.userJobTitle == 'SEC' ? `${this.userName} on behalf of ${this.userInformation.supervisorDetails.userName}` : this.userName,
        addedLoginId: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.loginId : this.loginId,
        toLoginId: this.addDelegateUserForm.value.delegateUser.loginId,
        delegateFrom: moment(new Date(this.addDelegateUserForm.value.from).toString()).format('DD/MM/YYYY'),
        delegateTo: moment(new Date(this.addDelegateUserForm.value.to).toString()).format('DD/MM/YYYY'),
        fromUserName: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.userName : this.userName,
        toUserName: this.addDelegateUserForm.value.delegateUser.userName,
        delegateReason: this.addDelegateUserForm.value.reason,
        toJobTitle: this.addDelegateUserForm.value.delegateUser.designation,
        fromJobTitle: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.userJobTitle : this.userJobTitle
      }
      let url = 'UserController/addDelegation';
      this.isLoading = true;
      this._loading.setLoading(true, url);
      this.coreService.post(url, delegateData).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        this.addDelegateUserForm.reset();
        this.notification.create(
          "success",
          "Success",
          "Delegation added successfully"
        );
        this.getSelfDelegatedUser();
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });
    }
  }

  addDelegateToOthers() {
    if (this.addToDelegateForm.status == "INVALID") {
      return;
    } else {
      var ToDate = new Date(this.addToDelegateForm.value.to);
      var FromDate = new Date(this.addToDelegateForm.value.from);
      ToDate.setUTCDate(ToDate.getUTCDate() + 1);
      FromDate.setUTCDate(FromDate.getUTCDate() + 1);
      let delegateData = {
        fromLoginId: this.addToDelegateForm.value.userData.loginId,
        addedUserName: this.userJobTitle == 'SEC' ? `${this.userName} on behalf of ${this.userInformation.supervisorDetails.userName}` : this.userName,
        addedLoginId: this.userJobTitle == 'SEC' ? this.userInformation.supervisorDetails.loginId : this.loginId,
        toLoginId: this.addToDelegateForm.value.delegateUserData.loginId,
        delegateFrom: moment(new Date(this.addToDelegateForm.value.from).toString()).format('DD/MM/YYYY'),
        delegateTo: moment(new Date(this.addToDelegateForm.value.to).toString()).format('DD/MM/YYYY'),
        fromUserName: this.addToDelegateForm.value.userData.userName,
        toUserName: this.addToDelegateForm.value.delegateUserData.userName,
        delegateReason: this.addToDelegateForm.value.reason,
        toJobTitle: this.addToDelegateForm.value.delegateUserData.designation,
        fromJobTitle: this.addToDelegateForm.value.userData.designation
      }
      let url = 'UserController/addDelegation';
      this.isLoading = true;
      this._loading.setLoading(true, url);
      this.coreService.post(url, delegateData).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        this.addToDelegateForm.reset();
        this.notification.create(
          "success",
          "Success",
          "Delegation added successfully"
        );
        this.filteredDelegateData = of([]);
        this.delegateUserDataControl.disable();
        this.isDisable = !this.isDisable;
        this.getOthersDelegatedUser();
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });

    }
  }

  deleteDelegation(delegation: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DELETE',
        dialogMessage: 'ARE_YOU_SURE_DELETE_DELEGATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        this._onDeleteDelegation(delegation.id);
      }
    });
  }

  editDelegation(delegation: any) {
    const delegationData = delegation
    const dialogRef = this.dialog.open(EditDelegationDialogComponent, {
      width: '800px',
      data: JSON.stringify(delegationData)
    });
    dialogRef.afterClosed().subscribe(result => {
      // 'Delegation updated successfully'
      if (result.event.message == 'Delegation updated successfully'  && !this.isAdmin && this.selectedTab == "self") {
        this.getSelfDelegatedUser();
      }else if(result.event.message == 'Delegation updated successfully' && !this.isAdmin && this.selectedTab == "others") {
        this.getOthersDelegatedUser();
      }else if(result.event.message == 'Delegation updated successfully' && this.isAdmin && this.selectedTab == "self") {
        this.getOthersDelegatedUser();
      }
    });
  }


  _onDeleteDelegation(delegationId: any) {
    this.isLoading = true;
    let url = 'UserController/deleteDelegate?delegateId=' + delegationId;
    this._loading.setLoading(true, url);
    this.coreService.delete(url, {}).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      if (!this.isAdmin && this.selectedTab == "self") {
        this.getSelfDelegatedUser();
      } else {
        this.getOthersDelegatedUser();
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      if (!this.isAdmin && this.selectedTab == "self") {
        this.getSelfDelegatedUser();
      } else {
        this.getOthersDelegatedUser();
      }
    });
  }

  selectedUser() {
    this.userDataControl.enable();
    this.delegateUserDataControl.enable();
    this.isDisable = !this.isDisable;
    let url = 'UserController/getDelegationUsersList?currentUserId=' + this.addToDelegateForm.value.userData.loginId;

    this.coreService.get(url).subscribe(response => {
      this.usersDelegate = response;
      // this.filteredDelegateData = this.addDelegateUserForm.controls['delegateUser'].valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : value.name),
      //   map(name => name ? this._filterDelegate(name) : this.usersDelegate.slice()));

      this.filteredDelegateData = this.addToDelegateForm.controls['delegateUserData'].valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value ? value.name : value),
        map(name => name ? this._filterDelegate(name) : this.usersDelegate.slice()));
    }, error => {
      console.log('error :', error);
    });
  }
}
