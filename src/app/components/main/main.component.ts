import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from 'src/app/services/core.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface DelegatedUsers {
  departmentCode: number;
  departmentName: string;
  loginId: string;
  userName: string;
  userJobTitle: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() foundError = new EventEmitter<string>();
  userName: string = '';
  inboxCount: number = 0;
  responseInprogCount: number = 0;
  isLoading: boolean = true;
  isHidden=false;
  isTestEnabled: boolean = false;
  selectedLang = 'en';
  rtlValue;
  reportYear: any;
  delegatedUsers: DelegatedUsers[] = [
    {
      departmentCode: 0,
      departmentName: "",
      loginId: "Main User",
      userName: "Select Delegate User",
      userJobTitle: ""
    }
  ];
  selectedDelegatedUser: DelegatedUsers;
  selectedDelegatedUserDetails:any;
  selectedDelegateUserInfo: any;
  userInfo: any;
  isAdmin: boolean = false;
  isAddUserPageEnabled: boolean = false;
  userJobTitle: string = '';
  countInterval: any;
  delegatedUserInfo: DelegatedUsers;
  isAdminLinkActive = false;
  currentRoute: any = '';
  subscription: any;

  constructor(
    public translate: TranslateService,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    translate.use('en');
    this.rtlValue = false;
    this.sharedVariableService.setRtlValue(this.rtlValue);

    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
       this.currentRoute = event.url;
      }
    })
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.sharedVariableService.getValue().subscribe((count) => {
      this.inboxCount = count;
    });
    this.sharedVariableService.getResponseInProgValue().subscribe((count) => {
      this.responseInprogCount = count;
    });
    this.sharedVariableService.getReportYearValue().subscribe((val) => {
      this.reportYear = val;
    });

    if(window.location.href.includes('/inbox') || window.location.href.includes('/')){
      this.clearFilter("inbox");
    }

    if (window.location.href.includes('escalation-settings') || window.location.href.includes('contact-detail') || window.location.href.includes('deactive-deco-notification')) {
      this.isAdminLinkActive = true;
    }

    // let data: any = localStorage.getItem('sabDelegateUser');
    // if (data) {
    //   this.selectedDelegateUserInfo = JSON.parse(data);
    // }
   this.getUserInfo();
  // this.getUserInfo111();
    this.countInterval = setInterval(() => this.checkCount(), 60000);
    localStorage.setItem('sabPaginatorInboxIndex', '0');
    localStorage.setItem('sabPaginatorSentItemsIndex', '0');
    localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
  }

  getUserInfo111() {

 let   response = 
 {
  "attachmentEnabled": true,
  "canReviewObservations": false,
  "sabMember": {
      "loginId": "ECMTEST_MSD_ENG",
      "extensionNo": "+965 11112222",
      "userName": "Government & Parliament Affairs Engineer",
      "userTitle": "Eng, Government & Parliament Affairs",
      "departmentName": "Management Support",
      "departmentCode": 110201,
      "directorateName": "Deputy C.E.O. For Admin. & Commercial",
      "directorateCode": 101320,
      "divisionCode": 110270,
      "supervisorLogin": "ECMTEST_TL_MS_CHANGE",
      "userMail": "CRN899@knpc.com",
      "userJobTitle": "ENG",
      "regMailDisabled": false,
      "esclatnMailDisabled": false
  },
  "inboxCount": 3,
  "responseInprogCount": 15,
  "admin": true,
  "reportYear": "2022-2023",
  "delegateUsers": [],
  "reportCycle": "SAB Semi-annual Report 2",
  "delegationAdminPageEnabled": true,
  "adminReAssignEnabled": true,
  "addUserPageEnabled": true
};

   this.sharedVariableService.setLoginValue(true);
   this.sharedVariableService.setSABUserInfo(response);
   this.isAdmin = response.admin;
   this.isAddUserPageEnabled = response.addUserPageEnabled;
   if(response.sabMember == null){
      this.foundError.emit("Error");
   }
   this.userJobTitle = response.sabMember.userJobTitle;
   if (response.sabMember.userName != null) {
     this.userInfo = response;
     // this.userName = response.sabMember.userName;
     this.inboxCount = response.inboxCount;
     this.responseInprogCount = response.responseInprogCount;
     this.reportYear = response.reportYear;
     if (this.selectedDelegateUserInfo) {
       this.userName = this.selectedDelegateUserInfo.userName;
       this.delegatedUsers[0].userName = "Reset User";
       let data = {
         departmentCode: response.sabMember.departmentCode,
         departmentName: response.sabMember.departmentName,
         loginId: response.sabMember.loginId,
         userName: response.sabMember.userName,
         userJobTitle: response.sabMember.userJobTitle
       }
       this.delegatedUsers.push(data);
     } else {
       this.userName = response.sabMember.userName;
       response.delegateUsers.map((data: any) => {
         this.delegatedUsers.push(data);
       })
     }
     this.selectedDelegatedUser = this.delegatedUsers[0];
     localStorage.setItem('userName', response.sabMember.userName);
     localStorage.setItem('userTitle', response.sabMember.userTitle);
     localStorage.setItem('loginId', response.sabMember.loginId);
     localStorage.setItem('userJobTitle', response.sabMember.userJobTitle);
     localStorage.setItem('departmentCode', response.sabMember.departmentCode.toString());
     localStorage.setItem('sabUserInformation', JSON.stringify(response));
     // localStorage.setItem('sabDelegateUser', JSON.stringify(this.selectedDelegatedUser));

     this.sharedVariableService.setUserInfoAvailable(true);
   
     this.isLoading = false;

   }

}
  getUserInfo() {
    this.isLoading = true;
  let _userId = '';
 // let _userId = 'ECMTest_Mgr_CP';
    // let _userId= 'ECMTEST_MGR_LM';
 //   let _userId = 'ECMTest_Mgr_CP';
   // let _userId= 'ECMTest_CEO';
  // let _userId = 'ECMTest_Mgr_CP';
    // let _userId= 'ECMTest_CEO';
    // let _userId= 'ECMTest_TL_CP_Perf';
    // let _userId = 'ECMTEST_USER1';
    // let _userId = 'ECMTEST_MGR_LM';
    // let _userId = 'ECMTEST_MAB_ENG';
    // let _userId = 'ECMTEST_TL_LM_FILLING';
   // let _userId = 'ECMTEST_IT_MGR';
    // let _userId = 'ECMTEST_IT_SRENG';  
    // let _userId= 'ECMTEST_TL_CP_PLANS3';
    // let _userId= 'ECMTEST_MGR_MS';
  //   let _userId= 'ECMTest_DCEO1';
//  let _userId= 'ECMTest_DCEOFSO';
   //let _userId= 'ECMTEST_DCEOPF';
   // let _userId ='ECMTest_MSG_Eng';
  
  //let _userId= 'ECMTest_DCEOSS';
//let _userId = 'ECMTest_HR_Eng';

    // let _userId = 'ECMTEST_HR_MGR';
    // let _userId = '';
    // let _userId = 'ECMTEST_DCEO1_SEC';
    // let _userId= 'ECMTest_User3';
   //  let _userId= 'ECMTest_User1';
    // let _userId= 'ECMTest_User2';
   //let _userId= 'ECMTest_TL_CP_Plans';
    // let _userId= 'ECMTest_HR_SRENG';
   //let _userId = 'ECMTEST_MGR_CP'
    // let _userId = 'ECMTEST_FIN?_MGR'

    if(_userId == ''){
      localStorage.removeItem('sabDelegateUser')
    }
    let url = 'UserController/getUserInfo?userId=' + _userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      //  response = {"attachmentEnabled":true,"sabMember":{"loginId":"ECMTEST_TL_CP_PLANS","userName":"Team Lead Plans Coordination","userTitle":"Team Lead, Plans Coordination","departmentName":"Corporate Planning","departmentCode":103010,"directorateName":"Deputy C.E.O. For Planning & Finance","directorateCode":101330,"divisionCode":103040,"supervisorLogin":"ECMTEST_MGR_CP","userMail":"CRN899@knpc.com","userJobTitle":"TL"},"inboxCount":7,"responseInprogCount":1,"admin":false,"reportYear":"2021-2022","delegateUsers":[{"loginId":"ECMTEST_MGR_CP","userName":"CPD Manager","userJobTitle":"MGR","departmentCode":0}],"reportCycle":"KNPC Response Report","delegationAdminPageEnabled":false,"adminReAssignEnabled":false,"addUserPageEnabled":false}

      this.sharedVariableService.setLoginValue(true);
      this.sharedVariableService.setSABUserInfo(response);
      this.isAdmin = response.admin;
      this.isAddUserPageEnabled = response.addUserPageEnabled;
      if(response.sabMember == null){
         this.foundError.emit("Error");
      }
      this.userJobTitle = response.sabMember.userJobTitle;
      if (response.sabMember.userName != null) {
        this.userInfo = response;
        // this.userName = response.sabMember.userName;
        this.inboxCount = response.inboxCount;
        this.responseInprogCount = response.responseInprogCount;
        this.reportYear = response.reportYear;
        if (this.selectedDelegateUserInfo) {
          this.userName = this.selectedDelegateUserInfo.userName;
          this.delegatedUsers[0].userName = "Reset User";
          let data = {
            departmentCode: response.sabMember.departmentCode,
            departmentName: response.sabMember.departmentName,
            loginId: response.sabMember.loginId,
            userName: response.sabMember.userName,
            userJobTitle: response.sabMember.userJobTitle
          }
          this.delegatedUsers.push(data);
        } else {
          this.userName = response.sabMember.userName;
          response.delegateUsers.map((data: any) => {
            this.delegatedUsers.push(data);
          })
        }
        this.selectedDelegatedUser = this.delegatedUsers[0];
        localStorage.setItem('userName', response.sabMember.userName);
        localStorage.setItem('userTitle', response.sabMember.userTitle);
        localStorage.setItem('loginId', response.sabMember.loginId);
        localStorage.setItem('userJobTitle', response.sabMember.userJobTitle);
        localStorage.setItem('departmentCode', response.sabMember.departmentCode.toString());
        localStorage.setItem('sabUserInformation', JSON.stringify(response));
        // localStorage.setItem('sabDelegateUser', JSON.stringify(this.selectedDelegatedUser));

        this.sharedVariableService.setUserInfoAvailable(true);
        // localStorage.setItem('sabIsAdmin', response.admin.toString());
        this.isLoading = false;
        // this.router.navigate(['/inbox']);
//
        //this.route.queryParams
        //.subscribe(params => {
        //  console.log(params); // { orderby: "price" }
//
          //  if(params && params.isDelegated){
            //  if(params.isDelegated == 'true'){
              //  console.log(localStorage.getItem('sabDelegateUser'))
               // let data:any = localStorage.getItem('sabDelegateUser')
              //  this.selectedDelegatedUser = JSON.parse(data);
              //  this.delegatedUserChange();
            //  }
          //  }else{
            //  // localStorage.removeItem('sabDelegateUser');
          //  }
      }
    //);
     // }
    }, error => {
      this.isLoading = false;
      console.log('error : ', error);
      this.foundError.emit("Error");
    });
  }

  flipDirection(val: string) {
    if (val == 'ar') {
      this.rtlValue = true;
      this.sharedVariableService.setRtlValue(this.rtlValue);
    } else {
      this.rtlValue = false;
      this.sharedVariableService.setRtlValue(this.rtlValue);
    }
  }

  clearFilter(val: any) {
    console.log(val)
    if (val == 'inbox') {
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabSearchObsTitle');
    localStorage.removeItem('sabSearchObsContent');
    localStorage.removeItem('sabSearchObsClassification');
    localStorage.removeItem('sabSearchObsFilterYear');
    localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
    localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear');
      localStorage.removeItem('sabArchivedObsTitle');
      localStorage.removeItem('sabArchivedObsFilterObsSequence');
      
    localStorage.removeItem('newRepeatFilter');
    localStorage.removeItem('newRepeatedType');
    localStorage.removeItem('newRepeatedYear');
    } else if (val == 'sent-items') {
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.removeItem('sabSearchObsTitle');
    localStorage.removeItem('sabSearchObsContent');
    localStorage.removeItem('sabSearchObsClassification');
    localStorage.removeItem('sabSearchObsFilterYear');
    localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
    localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear')
      localStorage.removeItem('sabArchivedObsTitle')
      localStorage.removeItem('sabArchivedObsFilterObsSequence')
      
    localStorage.removeItem('newRepeatFilter');
    localStorage.removeItem('newRepeatedType');
    localStorage.removeItem('newRepeatedYear');
    } else if (val == 'response-progress') {
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabSearchObsTitle');
      localStorage.removeItem('sabSearchObsContent');
      localStorage.removeItem('sabSearchObsClassification');
      localStorage.removeItem('sabSearchObsFilterYear');
      localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
      localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear')
      localStorage.removeItem('sabArchivedObsTitle')
      localStorage.removeItem('sabArchivedObsFilterObsSequence')
      
    localStorage.removeItem('newRepeatFilter');
    localStorage.removeItem('newRepeatedType');
    localStorage.removeItem('newRepeatedYear');
    } else if (val == 'search-observations') {
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear')
      localStorage.removeItem('sabArchivedObsTitle')
      localStorage.removeItem('sabArchivedObsFilterObsSequence')
      
    localStorage.removeItem('newRepeatFilter');
    localStorage.removeItem('newRepeatedType');
    localStorage.removeItem('newRepeatedYear');
    } else if(val == 'archived-observations'){
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem('sabSearchObsTitle');
      localStorage.removeItem('sabSearchObsContent');
      localStorage.removeItem('sabSearchObsClassification');
      localStorage.removeItem('sabSearchObsFilterYear');
      localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
      localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.removeItem("delegationTab");
      
    localStorage.removeItem('newRepeatFilter');
    localStorage.removeItem('newRepeatedType');
    localStorage.removeItem('newRepeatedYear');
    }else if(val == '/reports/new-or-repeated-report'){
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.removeItem('sabSearchObsTitle');
      localStorage.removeItem('sabSearchObsContent');
      localStorage.removeItem('sabSearchObsClassification');
      localStorage.removeItem('sabSearchObsFilterYear');
      localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
      localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear')
      localStorage.removeItem('sabArchivedObsTitle')
      localStorage.removeItem('sabArchivedObsFilterObsSequence')
    } else {
      localStorage.removeItem('sabFilterType');
      localStorage.removeItem('sabFilterSequence');
      localStorage.removeItem('sabFilterDepartment');
      localStorage.removeItem('sabFilterStatus');
      localStorage.removeItem('sabFilterReviewed');
      localStorage.removeItem('sabSentItemsFilterType');
      localStorage.removeItem('sabSentItemsFilterSequence');
      localStorage.removeItem('sabSentItemsFilterDepartment');
      localStorage.removeItem('sabSentItemsFilterStatus');
      localStorage.removeItem('sabSentItemsFilterDirectorate');
      localStorage.removeItem('sabSentItemsFilterBehalf');
      localStorage.removeItem('sabSentItemsFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterType');
      localStorage.removeItem('sabResponseProgressFilterReviewed');
      localStorage.removeItem('sabResponseProgressFilterSequence');
      localStorage.removeItem('sabResponseProgressFilterDepartment');
      localStorage.removeItem('sabResponseProgressFilterStatus');
      localStorage.removeItem('sabResponseProgressFilterDirectorate');
      localStorage.removeItem('sabResponseProgressFilterBehalf');
      localStorage.removeItem('sabResponseProgressFilterMultipleDept');
      localStorage.removeItem('sabResponseProgressFilterReminderCount');
      localStorage.removeItem('sabSearchObsTitle');
      localStorage.removeItem('sabSearchObsContent');
      localStorage.removeItem('sabSearchObsClassification');
      localStorage.removeItem('sabSearchObsFilterYear');
      localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
      localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
      localStorage.setItem('sabPaginatorResponseProgressIndex', '0');
      localStorage.setItem('sabPaginatorInboxIndex', '0');
      localStorage.setItem('sabPaginatorSentItemsIndex', '0');
      localStorage.removeItem("delegationTab");
      localStorage.removeItem('sabArchivedObsFilterYear')
      localStorage.removeItem('sabArchivedObsTitle')
      localStorage.removeItem('sabArchivedObsFilterObsSequence')

      localStorage.removeItem('newRepeatFilter');
      localStorage.removeItem('newRepeatedType');
      localStorage.removeItem('newRepeatedYear');
    }

    if( val == 'escalation-settings' || val == 'contact-detail' || val=='deactive-deco-notification'){
      this.isAdminLinkActive = true
    }else{
      this.isAdminLinkActive = false
    }
  }

  delegatedUserChange() {
    if (this.delegatedUsers[0].userName == 'Select Delegate User') {
      // if (this.selectedDelegatedUser.departmentCode != 0) {
      if (this.selectedDelegatedUser.loginId != 'Main User') {
        this.userName = this.selectedDelegatedUser.userName;
        // this.selectedDelegatedUser.userJobTitle = this.userInfo.sabMember.userJobTitle;
        localStorage.setItem('sabDelegateUser', JSON.stringify(this.selectedDelegatedUser));
        this.selectedDelegatedUserDetails = this.selectedDelegatedUser;
        console.log(this.selectedDelegatedUserDetails , "this.selectedDelegatedUserDetails 1")
        this.delegatedUsers = [
          {
            departmentCode: 0,
            departmentName: "",
            loginId: "Delegated User",
            userName: "Reset User",
            userJobTitle: ""
          }
        ];
        let data = {
          departmentCode: this.userInfo.sabMember.departmentCode,
          departmentName: this.userInfo.sabMember.departmentName,
          loginId: this.userInfo.sabMember.loginId,
          userName: this.userInfo.sabMember.userName,
          userJobTitle: this.userInfo.sabMember.userJobTitle
        }
        this.delegatedUsers.push(data);
        this.delegatedUserInfo = this.selectedDelegatedUser;
        this.selectedDelegatedUser = this.delegatedUsers[0];
        this.sharedVariableService.setDelegateUserValue(true);
        this.clearFilter("updateDelegate");
        this.router.navigate(['/inbox']);
      }
    } else {
      this.selectedDelegatedUserDetails = null;
      console.log(this.selectedDelegatedUserDetails , "this.selectedDelegatedUserDetails 2")
      // if (this.selectedDelegatedUser.departmentCode != 0) {
      if (this.selectedDelegatedUser.loginId != 'Delegated User') {
        this.userName = this.userInfo.sabMember.userName;
        localStorage.removeItem('sabDelegateUser');
        this.delegatedUsers = [
          {
            departmentCode: 0,
            departmentName: "",
            loginId: "Main User",
            userName: "Select Delegate User",
            userJobTitle: ""
          }
        ];
        this.userInfo.delegateUsers.map((data: any) => {
          this.delegatedUsers.push(data);
        })
        this.selectedDelegatedUser = this.delegatedUsers[0];
        this.sharedVariableService.setDelegateUserValue(true);
        this.clearFilter("updateDelegate");
        this.router.navigate(['/inbox']);
      }
    }  
    this.checkCount();  
    
  }

  checkCount() {
    let userData: any = localStorage.getItem('sabUserInformation');
    let userInformation = JSON.parse(userData);
    let _userId = userInformation.sabMember.loginId;    
    let ifForOnBehalfUser = false;
    let data: any = localStorage.getItem('sabDelegateUser');
    if (data) {
      this.selectedDelegateUserInfo = JSON.parse(data);
      _userId = this.selectedDelegateUserInfo.loginId
      ifForOnBehalfUser = true;
    } 
    if (this.userJobTitle == 'SEC'){
      _userId = userInformation.supervisorDetails.loginId;
      ifForOnBehalfUser = true;
    }

    let url = 'UserController/getUserInfo?ifForOnBehalfUser='+ ifForOnBehalfUser +'&userId=' + _userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this.coreService.get(url).subscribe(response => {
      this.inboxCount = response.inboxCount;
      this.responseInprogCount = response.responseInprogCount;
    })
  }
}
