import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd,  Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ApproveComponent } from '../approve/approve.component';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DepartmentTransferComponent } from '../department-transfer/department-transfer.component';
import { EmailDocumentComponent } from '../email-document/email-document.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { PastHistoryComponent } from '../past-history/past-history.component';
import { ReminderHistoryComponent } from '../reminder-history/reminder-history.component';
import { OverviewComponent } from '../overview/overview.component';
import { SendResponseBehalfComponent } from '../send-response-behalf/send-response-behalf.component';
import 'rxjs/add/operator/filter';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { ContactPersonDetailsComponent } from '../contact-person-details/contact-person-details.component';
import { WorkingDepartmentListComponent } from '../working-department-list/working-department-list.component';
import { SendBackReasonsComponent } from '../sendback-reasons/sendback-reasons.component';
import { SendBackComponent } from '../send-back/send-back.component';
import { CancelSendBackComponent } from '../cancel-send-back/cancel-send-back.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { UpdateResponseAdminComponent } from '../update-response-admin/update-response-admin.component';

@Component({
  selector: 'app-response-progress-work-details',
  templateUrl: './response-progress-work-details.component.html',
  styleUrls: ['./response-progress-work-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResponseProgressWorkDetailsComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'historyDate', 'stepName', 'responseTaken', 'from', 'to'];
  id: string;
  obsId: string;
  stepUnqName: string;
  pendingUser: string;
  deptCycleId: string;
  status: string;
  workItem: any;
  loginId: string;
  expansionPanel = true;
  isLoading: boolean = true;
  reportCycle: string
  actionType: string;
  // isDialogLoading: boolean;
  isRtl: any;
  userInformation: any;
  isAdmin: boolean = false;
  adminReAssignEnabled: boolean = false;
  userJobTitle: string;
  departmentCode: number;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  selectedDelegateUserInfo: any;
  userId: any;
  userName: any;
  isSpecialCondition: boolean;
  gandpaNotes: string = '';
  seriousNotes: string = '';
  stepUniqueName: any;
  approveEnabled: any;
  isDateFieldSelected: boolean;
  obsCategory: any;
  isSpecialNatureSpecialCondition: boolean;
  isSendReminderEnabled: boolean = false;
  isSendReminderLabelEnabled: boolean = false;
  selectedList:any =[];
  selectedIndex = 0;
  seriousNotesOptions = [
    { "value": "تم تسويتها" },
    { "value": "تم تسوية جزء منها" },
    { "value": "لم يتم تسويتها" },
  ]
  isReviewEnabled= false;
  subscription: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private notification: NzNotificationService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.subscription = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
        this.route.params.subscribe(params => {
          this.id = params['stepCustomId'];
        });
        this.route.queryParams.subscribe(params => {
          this.obsId = params['obsId'];
          this.stepUnqName = params['stepUnqName'];
          this.pendingUser = params['pendingUser'];
          let temp:any = localStorage.getItem('selectedIndex')
          if(temp){
            this.selectedIndex =  JSON.parse(temp);
          }
          let selectedIndex = params['selectedIndex'];
          this.selectedIndex = +selectedIndex === 0 ? +selectedIndex : (+selectedIndex || this.selectedIndex);
          // this.selectedIndex =  JSON.parse(localStorage.getItem('selectedIndex'));
          this.selectedList= localStorage.getItem('responseItems');
          if(this.selectedList){
            this.selectedList= JSON.parse(this.selectedList)
          }
        }
        );
        let data: any = localStorage.getItem('sabUserInformation');
        this.userInformation = JSON.parse(data);
        this.isAdmin = this.userInformation.admin;
        this.adminReAssignEnabled = this.userInformation.adminReAssignEnabled;
        this.userJobTitle = this.userInformation.sabMember.userJobTitle;
        this.departmentCode = this.userInformation.sabMember.departmentCode;
        this.userId = this.userInformation.sabMember.loginId;
        this.userName = this.userInformation.sabMember.userName;
        //departmentCode
        if (this.userInformation.canReviewObservations) {
          this.isReviewEnabled= true;
        }
        this.getWorkItemInfo();
      }
    });
   }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
   }

  ngOnInit(): void {
    // this.expansionPanel=false;
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.loginId = localStorage.getItem('loginId') || '';

   
  }



  getWorkItemInfo() {
    //console.log('this.stepUnqName ::',this.stepUnqName);
    //console.log('this.pendingUser  ::',this.pendingUser );
    //console.log('this.id   ::',this.id  );
    //console.log('this.id   ::',this.obsId );

    this.isLoading = true;
    let url = 'InProgController/getInProgressDetails?stepCustomId=' + this.id + '&isAdminReAssignEnabled=' + this.userInformation.adminReAssignEnabled;
    if (this.stepUnqName == 'GPA-Pending-Extraction') {
      url = 'InProgController/getCommentryItemInfo?obsId=' + this.obsId;
    }
    if (this.userJobTitle == 'SEC') {
      url = url + '&isAdmin=' + this.isAdmin + '&jobTitle=' + this.userInformation.supervisorDetails.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.selectedDelegateUserInfo) {
        url = url + '&isAdmin=' + this.isAdmin + '&jobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isAdmin=' + this.isAdmin + '&jobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
    //---remove  
    //----remove
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.deptCycleId = response.deptCycleId;
      this.status = response.status;
      this.reportCycle = response.reportCycle;
      this.stepUniqueName = response.stepUniqueName;
      this.approveEnabled = response.approveEnabled;
      this.obsCategory = response.obsCategory;
      if (response.completionYear == 'متباين الرأى بشأنها' || response.completionYear == 'تتعلق بجهات حكومية/اخرى' || response.completionYear == 'Completed') {
        this.isDateFieldSelected = false;
      } else {
        this.isDateFieldSelected = true;
      }
      if(this.isReviewEnabled && !(response.stepUniqueName=='G&PA Park' || response.stepUniqueName=='G&PAApprove' || response.stepUniqueName=='G&PAApprove-EditResponse' 
      || response.stepUniqueName=='G&PACOombineResponse' || response.stepUniqueName=='NORMAL-DCEO-OR-CEO-APPROVAL' )){
 this. isReviewEnabled = false;
      }
      
      this.workItem = response;

      for (let i = 0; i < this.workItem?.irDetails?.length; i++) {
        if (this.workItem.irDetails[i].reportName === "Initial Response") {
          this.workItem.irDetails[i].reportContent = this.workItem.irDetails[i].reportContent.replace(/&nbsp;/ig, " ");
        }
      }

      if (this.workItem.seriousNotes) {
        this.seriousNotes = this.workItem.seriousNotes;
      }
      if (this.workItem.callDate) {
        var callDate = new Date(this.workItem.callDate);
        callDate.setDate(callDate.getDate())
        callDate.setHours(0, 0, 0, 0);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today >= callDate) {
          if (this.obsCategory == 'Normal') {
            if (this.isAdmin) {
              this.isSpecialCondition = false;
            } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {
              // this.isSpecialCondition = true;
              if (this.workItem.isGpaSentBack) {
                let gpaSendBackDate = new Date(this.workItem.gpaSendBackDate);
                gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                gpaSendBackDate.setHours(0, 0, 0, 0);
                if (today <= gpaSendBackDate) {
                  // don nothing this.isSpecialCondition = true;
                } else {
                  this.isSpecialCondition = true;
                }
              } else {
                this.isSpecialCondition = true;
              }
            }
          } else if (this.obsCategory == 'Special Nature') {
            if (this.isAdmin) {
              this.isSpecialNatureSpecialCondition = false;
            } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'CEO' || this.userJobTitle == 'DCEO' || this.userJobTitle == 'SEC') {
              // this.isSpecialNatureSpecialCondition = true;
              if (this.workItem.isGpaSentBack) {
                let gpaSendBackDate = new Date(this.workItem.gpaSendBackDate);
                gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                gpaSendBackDate.setHours(0, 0, 0, 0);
                if (today <= gpaSendBackDate) {
                } else {
                  this.isSpecialNatureSpecialCondition = true;
                }
              } else {
                this.isSpecialNatureSpecialCondition = true;
              }
            }
          }
        }
      }
      if (this.workItem.comments) {
        this.workItem.comments.map((data: any, index: any) => {
          let result = this.isArabic(data.comment);
          data.isArabic = result;
        })
      }
      

      if(this.selectedDelegateUserInfo && 
        (this.selectedDelegateUserInfo.userJobTitle =='MGR' || this.selectedDelegateUserInfo.userJobTitle =='TL')){
          this.isSendReminderEnabled = true;
          this.isSendReminderLabelEnabled = true;
      }else if(this.userJobTitle == 'SEC' &&
       (this.userInformation.supervisorDetails.userJobTitle =='MGR' ||
       this.userInformation.supervisorDetails.userJobTitle =='TL')){
        this.isSendReminderEnabled = true;
        this.isSendReminderLabelEnabled = true;
      }else if(this.isAdmin ||  this.userJobTitle=='MGR' || this.userJobTitle=='TL'){
        this.isSendReminderEnabled = true;
        this.isSendReminderLabelEnabled = true;
      }else{
        this.isSendReminderEnabled = false;
        this.isSendReminderLabelEnabled = false;
      }

      if (response.stepUniqueName == 'NORMAL-DCEO-OR-CEO-APPROVAL' || response.stepUniqueName == 'G&PAApprove' || response.stepUniqueName == 'G&PAReview' || response.stepUniqueName == "MGR-PENDING-COMBINING" ||
        response.stepUniqueName == "G&PACOombineResponse" || response.stepUniqueName == "SN-CEO-APPROVAL-COMBINE" || response.stepUniqueName == "GPA-ASSIGN" ||
        response.stepUniqueName == "G&PA Park" || response.stepUniqueName == "G&PAApprove-EditResponse" || response.stepUniqueName == 'GPA-Pending-Extraction') {
        this.isSendReminderEnabled = false;
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
    });
  }

  isArabic(comment: string) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(comment)
    return result;
  }

  onReAssignToExecutive(): void {
    // this.isDialogLoading = true;
    // let url = 'UserController/getExecutiveUsers?r=' + (Math.floor(Math.random() * 100) + 100);
    let url = 'UserController/getExecutiveUsers';
    if (this.selectedDelegateUserInfo) {
      url = url + '?isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&operationType=ReAssign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&operationType=ReAssign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;

      } else {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userId + '&operationType=ReAssign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;

      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;      
      let isManagerTabHide = false;
      if (this.workItem.obsCategory == 'Special Nature' && this.workItem.status == 'Pending DCEO Approval') {
        isManagerTabHide = true;
      }
      this._loading.setLoading(false, url);
      let _response = {
        "execUsers": response,
        "dialougeType": 'ReAssign',
        "isManagerTabHide": isManagerTabHide,
        "activeParticipants": this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToExecutiveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.userInformation.sabMember.loginId;
        let isDelegatedUser = false;
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = true;
        } else if (this.userJobTitle == 'SEC') {
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        if (result && result.event == 'Send') {
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var assignToExecData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            staffMemebers: result.data.selectedExecutives,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToExecutives(assignToExecData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  sendToExecutives(result: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/reAssignToExecutive';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onEditResponse(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'Edit Response',
        dialogMessage: 'ARE_YOU_SURE_EDIT_RESPONSE_OBSERVATION'
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
    let url = 'InProgController/editResponse?stepCustomId=' + this.id + '&userName=' + this.userName + '&comment=' + result.data.comment + '&departmentCode=' + this.departmentCode + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + '&loginId=';;
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
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onRemove(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'REMOVE_DEPARTMENT',
        dialogMessage: 'ARE_YOU_SURE_REMOVE_OBSERVATION',
        name: this.workItem.departmentName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onRemove(result);
      }
    });
  }

  _onRemove(result: any): void {
    // this.isDialogLoading = true;
    //  this.userJobTitle = 'weewe';
    //  this.departmentCode = 2323;
    // let url = 'InProgController/removeObservation?stepCustomId=' + this.id + '&departmentCode=' + this.departmentCode + '&userJobTitle=' + this.userJobTitle + '&comment=' + result.data.comment + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + "&r=" + (Math.floor(Math.random() * 100) + 100);     
    let url = 'InProgController/removeObservation?stepCustomId=' + this.id + '&departmentCode=' + this.departmentCode + '&comment=' + result.data.comment + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + '&loginId=';;
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
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onRemoveDepartment(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'REMOVE_THIS_OBSERVATION_DECLINE_BY_DEPARTMENT',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_REMOVE_THIS_OBSERVATION_DECLINE_BY_DEPARTMENT',

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onRemoveDepartment(result);
      }
    });
  }

  _onRemoveDepartment(result: any): void {

    let url = 'workItemController/removeWorkitem?stepCustomId=' + this.id + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + '&userJobTitle=' + this.userJobTitle;
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }



  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'CANCEL',
        dialogMessage: 'ARE_YOU_SURE_REMOVE_OBSERVATION',
        name: this.pendingUser
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onCancel(result);
      }
    });
  }

  _onCancel(result: any): void {
    // this.isDialogLoading = true;
    // this.userJobTitle = 'weewe';
    // this.departmentCode = 2323;
    // let url = 'InProgController/cancelObservation?stepCustomId=' + this.id + '&departmentCode=' + this.departmentCode + '&userJobTitle=' + this.userJobTitle + '&comment=' + result.data.comment + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + "&r=" + (Math.floor(Math.random() * 100) + 100);    
    let url = 'InProgController/cancelObservation?stepCustomId=' + this.id + '&departmentCode=' + this.departmentCode + '&comment=' + result.data.comment + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + '&loginId=';
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
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  cancelSendBack(): void {
    var wid, height;
      wid = '600px';
      height = '400px';
    const dialogRef = this.dialog.open(CancelSendBackComponent, {
      width: wid,
      height: height,
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _response = result.data;
        this._cancelSendBack(_response);
      }
    });
  }

  _cancelSendBack(data: any): void {
    let url = 'InProgController/cancelSendBack?stepCustomId=' + this.id+'&isSkipMail='+data.isSkipMail;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }

    }
    if (data.reason) {
      url = url + "&comment=" + encodeURIComponent(data.comment.trim()) + "&reason=" + data.reason + "&r=" + (Math.floor(Math.random() * 100) + 100);
    } else {
      url = url + "&comment=" + encodeURIComponent(data.comment.trim()) + "&r=" + (Math.floor(Math.random() * 100) + 100);
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onRecall(): void {
    let departmentsList: any = "N/A (G&PA Responded on Behalf)";
    // this.workItem.assignedDepartmentNames = "N/A (G&PA Responded on Behalf) ; N/A (G&PA Responded on Behalf) ; N/A (G&PA Responded on Behalf) ;" 
    if (this.workItem.obsCategory == 'Normal' && this.workItem.assignedDepartmentNames && this.workItem.assignedDepartmentNames.length > 0) {
      departmentsList = this.workItem.assignedDepartmentNames.split(' ; ');
      departmentsList.pop(departmentsList.length - 1);
      departmentsList = departmentsList.join(', ');
    }
    if (this.workItem.obsCategory == 'CategoryGPA') {
      departmentsList = "N/A (G&PA Responded on Behalf)";
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'RECALL',
        dialogMessage: 'ARE_YOU_SURE_RECALL_OBSERVATION',
        name: this.workItem.obsCategory == "Special Nature" ? 'CEO' : (this.workItem.obsCategory == "Committee" ? "Committee" : departmentsList)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onRecall(result);
      }
    });
  }

  _onRecall(result: any): void {
    let url = '/InProgController/reCallObservaion?stepCustomId=' + this.id + '&userLogin=' + this.loginId;
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onApproveBehalf(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id + '&loginId=';
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
      response.reportCycle = this.reportCycle;
      response.stepUniqueName = this.stepUniqueName;
      response.approveEnabled = this.approveEnabled;
      let _response = {
        "responseData": response,
        "dialogueType": 'APPROVE_ON_BEHALF'
      };
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.userInformation.sabMember.loginId;
        let isDelegatedUser = "false";
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = "true";
        } else if (this.userJobTitle == 'SEC') {
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        if (result.event == 'Send') {
          let formData: FormData = new FormData();
          formData.append('stepCustomId', this.id);
          formData.append('approvedBy', this.userInformation.sabMember.loginId);
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('attach', result.data.attach);
          formData.append('userJobTitle', this.userJobTitle);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          formData.append('loginId', this.userInformation.sabMember.logInId);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          this._onApprove(formData);
        }
        if (result.event == 'draft') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            draftResponse: result.data.editorData,
            completionYear: result.data.completionYear,
            classification:result.data.classification,
            govtEntity:result.data.govtEntity
          }
          this._onDraft(draftData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  _onApprove(data: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/approveResponseOnBehalf';
    // let url = 'workItemController/approveResponse?stepCustomId=' + this.id + '&stepResponse=' + result + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  _onDraft(data: any) {
    let url = 'workItemController/AddOrUpdateDraftResponse';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      this._loading.setLoading(false, url);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onReAssignToCommitte(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getCommitteeUsers?loginId=';
    if (this.selectedDelegateUserInfo) {
      // url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);

      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);

      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      let _response = {
        "committeeusers": response,
        "dialougeType": 'RE_ASSIGN_COMMITTEE'
      };
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(AssignToCommitteeComponent, {
        width: '500px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
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
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            selectedFormatter: result.data.selectedFormatters,
            selectedHead: result.data.selectedHeads,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToCommittee(_result);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  sendToCommittee(result: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/reAssignToComittee';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(Response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

   onClickComment() {
    if (!this.workItem.checked1) {
      this.workItem.checked1 = true;

      for (let i in this.workItem.comments) {
        // if (this.workItem.comments[i].isExpanded) {
          delete this.workItem.comments[i].isExpanded;
        // }
      }
      setTimeout(() => {
        for (let i in this.workItem.comments) {
          if (this.workItem.comments[i].isExpanded == undefined) {
            this.workItem.comments[i].isExpanded = true;
          }
        }
        delete this.workItem.checked1;
      }, 200)
    }
  }

  onReAssignStaff(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getStaffMembers?userId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&deptCycleId=" + this.deptCycleId + "&operationType=ReAssign&loginId=";
    if (this.selectedDelegateUserInfo) {
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;;
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100) + '&isAdmin=' + this.isAdmin;;
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      let isStaffTabHide = false;
      if (this.workItem.obsCategory == 'Normal' && this.workItem.status == 'Pending TeamLead Approval') {
        isStaffTabHide = true;
      }
      this._loading.setLoading(false, url);
      var _input = {
        departmentData: response,
        dialougeType: 'RE_ASSIGN_STAFF',
        isStaffTabHide: isStaffTabHide,
        activeParticipants: this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToStaffComponent, {
        width: '800px',
        data: _input
      });
      dialogRef.afterClosed().subscribe(result => {
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
          stepIds.push(this.id);
          var assignToStaffData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            userId: this.loginId,
            staffMemebers: result.data.selectedStaff,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToStaff(assignToStaffData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  sendToStaff(result: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/reassignToStaff';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onRespondOnBehalf(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id + '&loginId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      //  response = {"obsResponse":"<p>بناءً على جاهزية الوحدات للتشغيل، حيث أن خطة التدريب تستلزم تزامن التدريب قبل تسليم الوحدة بفترة زمنية قصيرة، حيث تم تنفيذ متطلبات التدريب حسب شروط العقد، علماً بأنه تم استلام جميع المواد والمعدات الأساسية للتشغيل، كما قامت الشركة باستيراد منتج البنزين لتلبية احتياجات السوق المحلي ومن المتوقع أن تقوم الشركة بتلبية احتياجات السوق المحلي الحالية بعد تشغيل وحدات انتاج البنزين من ضمن مشروع الوقود البيئي، هذا وترجع أسباب الأرباح غير المحققة من مشروع الوقود البيئي إلى التأخر في تنفيذ المشروع حسب ما تم ذكره سابقاً، هذا ولن تدخر الشركة أي مجهود وسوف تقوم بعمل كل ما في وسعها لمحاولة العمل على إتمام المشروع بالسرعة الممكنة</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KGOC","govtEntity":"KGOC","completionYear":"تتعلق بجهات حكومية/اخرى","type":"success","attachmens":[],"obsSeq":0}
      response.reportCycle = this.reportCycle;
      response.status = this.workItem.status;
      const dialogRef = this.dialog.open(SendResponseBehalfComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.userInformation.sabMember.loginId;
        let isDelegatedUser = "false";
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = "true";
        } else if (this.userJobTitle == 'SEC') {
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        if (result.event == 'Send') {
          let formData: FormData = new FormData();
          formData.append('stepCustomId', this.id);
          formData.append('approvedBy', this.userInformation.sabMember.loginId);
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('attach', result.data.attach);
          formData.append('userId', this.loginId);
          formData.append('userJobTitle', this.userJobTitle);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          formData.append('loginId', this.loginId);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          this._respondOnBehalf(formData);
        }
        if (result.event == 'draft') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            draftResponse: result.data.editorData,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser,
            completionYear: result.data.completionYear,
            classification:result.data.classification,
            govtEntity:result.data.govtEntity
          }
          this._onDraft(draftData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  _respondOnBehalf(data: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/respondOnBehalf';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }


  onShareDept(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'ADD_DEPARTMENT',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_ADD_NEW_DEPARTMENT_FOR_THIS_OBSERVATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        // this.isDialogLoading = true;
        let url = 'UserController/getDepartments?userId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&actionType=share&reportCycle=" + this.reportCycle + '&loginId=';
        if (this.selectedDelegateUserInfo) {
          url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        } else {
          if (this.userJobTitle == 'SEC') {
            url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          } else {
            url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          }
        }
        this._loading.setLoading(true, url);
        this.coreService.get(url).subscribe(response => {
          // this.isDialogLoading = false;
          this._loading.setLoading(false, url);
          //DepartmentTransferComponent
          let _result = {
            "directoratesList": response,
            "noOfActiveDepts": this.workItem.noOfActiveDepts,
            "dialogName": 'Share'
          }
          const dialogRef = this.dialog.open(DepartmentTransferComponent, {
            data: _result
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Send') {
              let _onBehalf = this.userInformation.sabMember.loginId;
              let isDelegatedUser = false;

              if (this.selectedDelegateUserInfo) {
                _onBehalf = this.selectedDelegateUserInfo.loginId;
                isDelegatedUser = true;
              } else if (this.userJobTitle == 'SEC') {
                _onBehalf = this.userInformation.supervisorDetails.loginId;
              }
              var stepIds: Array<string> = [];
              stepIds.push(this.id);
              var transferToDeptData = {
                stepCustomIds: stepIds,
                groupComment: result.data.groupComment,
                managers: result.data.selectedManagers,
                userId: this.loginId,
                userJobTitle: this.userJobTitle,
                onBhalfOf: _onBehalf,
                delegatedUser: isDelegatedUser
              }
              this.shareDeptartment(transferToDeptData);
            }
          });
        }, error => {
          // this.isDialogLoading = false;
          this._loading.setLoading(false, url);
          console.log('error  :', error);
        })
      }
    });
  }

  shareDeptartment(result: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/shareToDepartments';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onTransferDept(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'REASSIGN_DEPARTMENT',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_REASSIGN_THIS_OBSERVATION_TO_ANOTHER_DEPARTMENT'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        // this.isDialogLoading = true;
        let url = 'UserController/getDepartments?userId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&actionType=share&reportCycle=" + this.reportCycle + '&loginId=';
        if (this.selectedDelegateUserInfo) {
          url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
        } else {
          if (this.userJobTitle == 'SEC') {
            url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          } else {
            url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          }
        }
        this._loading.setLoading(true, url);
        this.coreService.get(url).subscribe(response => {
          // this.isDialogLoading = false;
          this._loading.setLoading(false, url);
          //DepartmentTransferComponent
          let _result = {
            "directoratesList": response,
            "noOfActiveDepts": this.workItem.noOfActiveDepts,
            "dialogName": 'Transfer'
          }
          const dialogRef = this.dialog.open(DepartmentTransferComponent, {
            data: _result
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Send') {
              let _onBehalf = this.userInformation.sabMember.loginId;
              let isDelegatedUser = false;
              if (this.selectedDelegateUserInfo) {
                _onBehalf = this.selectedDelegateUserInfo.loginId;
                isDelegatedUser = true;
              } else if (this.userJobTitle == 'SEC') {
                _onBehalf = this.userInformation.supervisorDetails.loginId;
              }
              var stepIds: Array<string> = [];
              stepIds.push(this.id);
              var transferToDeptData = {
                stepCustomIds: stepIds,
                groupComment: result.data.groupComment,
                managers: result.data.selectedManagers,
                userId: this.loginId,
                userJobTitle: this.userJobTitle,
                onBhalfOf: _onBehalf,
                delegatedUser: isDelegatedUser
              }
              this.tansferDeptartment(transferToDeptData);
            }
          });
        }, error => {
          // this.isDialogLoading = false;
          this._loading.setLoading(false, url);
          console.log('error  :', error);
        })
      }
    });
  }

  tansferDeptartment(result: any): void {
    // this.isDialogLoading = true;
    let url = 'InProgController/transferToDepartments';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onChangeToCommittee(): void {
    let url = 'UserController/getCommitteeUsers';
    if (this.selectedDelegateUserInfo) {
      url = url + '?isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&loginId=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&loginId=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userId + '&loginId=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      let _response = {
        "committeeusers": response,
        "dialougeType": 'CHANGE_TO_COMMITTEE'
      };
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(AssignToCommitteeComponent, {
        width: '500px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
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
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            selectedFormatter: result.data.selectedFormatters,
            selectedHead: result.data.selectedHeads,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.changeToCommittee(_result);
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }



  changeToCommittee(result: any): void {
    let url = 'InProgController/changeToCommittee';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(Response => {
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onReAssignToCommitteeHead(): void {
    let url = 'UserController/getCommitteeUsers?committeeId='+this.deptCycleId+'&loginId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      let _response = {
        "committeeusers": response,
        "dialougeType": 'RE_ASSIGN_COMMITTEE_HEAD'
      };
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(AssignToCommitteeComponent, {
        width: '500px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
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
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            // selectedFormatter: result.data.selectedFormatters,
            selectedHead: result.data.selectedHeads,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToCommitteeHead(_result);
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  sendToCommitteeHead(result: any): void {
    let url = 'InProgController/reAssignCommitteeHeader';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(Response => {
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onReAssignToCommitteeFormatter(): void {
    let url = 'UserController/getCommitteeUsers?committeeId='+this.deptCycleId+'&loginId=';
    //let url = 'UserController/getCommitteeUsers?loginId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      let _response = {
        "committeeusers": response,
        "dialougeType": 'RE_ASSIGN_COMMITTEE_FORMATTER'
      };
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(AssignToCommitteeComponent, {
        width: '500px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
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
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            selectedFormatter: result.data.selectedFormatters,
            // selectedHead: result.data.selectedHeads,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
          this.sendToCommitteeFormatter(_result);
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  sendToCommitteeFormatter(result: any): void {
    let url = 'InProgController/reAssignCommitteeFormatter';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(Response => {
      this._loading.setLoading(false, url);
      this.router.navigate(['/response-progress']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onExapnd(data: any) {
    let observation = {
      obsContent: data
    }
    const dialogRef = this.dialog.open(ExpandContentComponent, {
      data: observation
    });
  }

  tabClick() {
    this.onClickComment();
  //  this.accordion.closeAll();
  }

  onSend() {
    let stepUnqName ='';
    if(this.workItem.stepUniqueName =='G&PA Park'){
      stepUnqName = 'GPA Park';
    }else if(this.workItem.stepUniqueName =='G&PAApprove-EditResponse'){
      stepUnqName = 'GPAApprove-EditResponse';
    }else{
      stepUnqName = this.workItem.stepUniqueName;
    }
    let url = 'InProgController/saveNotes?obsId=' + this.obsId + '&userId=' + this.userId+ '&departmentName=' + this.workItem.departmentName + '&cycleId=' + this.workItem.deptCycleId+'&stepUniqName='+stepUnqName + '&seriousNotes=&notes=' + this.gandpaNotes;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.gandpaNotes = '';
      this.workItem.observationNotes = response;
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onSaveSeriousNotes() {
    let url = 'InProgController/saveSeriousNotes?obsId=' + this.obsId + '&userId=' + this.userId + '&seriousNotes=' + this.seriousNotes;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      //  this.workItem.observationNotes = response;
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }
  _onAddComment(data: any): void {
    let url = 'InProgController/addComment?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }

    }
  url = url + "&comment=" + encodeURIComponent(data.comment.trim()) + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.getWorkItemInfo();
     // this.router.navigate(['/response-progress']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }
  addGPAComment(): void {

    const dialogRef = this.dialog.open(AddCommentComponent, {
      width: '600px',
      height: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _response = result.data;
        this._onAddComment(_response);
      }
    });
    
  }

  onPastHistory(): void {
    let url = 'workItemController/getPastHistory?stepCustomId=' + this.id + '&obsId=' + this.obsId;
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      const dialogRef = this.dialog.open(PastHistoryComponent, {
        width: '800px',
        data: response
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onEmailDocument(): void {
    // let url = 'UserController/getSabEmployees';
    // this._loading.setLoading(true, url);
    // this.coreService.get(url).subscribe(response => {
      // this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(EmailDocumentComponent, {
        width: '800px',
        data: { id: this.id, response: [] },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Send') {
          let _onBehalf = this.userInformation.sabMember.loginId;
          let isDelegatedUser = false;
          if (this.selectedDelegateUserInfo) {
            _onBehalf = this.selectedDelegateUserInfo.loginId;
            isDelegatedUser = true;
          } else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          var transferToDeptData = {
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser,
            obsId: this.obsId,
            body: result.data.body,
            subject: result.data.subject,
            toMailIds: result.data.toMailIds,
            stepUnqName:'',
            ccMailIds: result.data.ccMailIds,
            workItemId: this.id
          }
          this.sendMail(transferToDeptData);
        }
      });
    // }, error => {
    //   // this.isDialogLoading = false;
    //   this._loading.setLoading(false, url);
    //   console.log('error :', error);
    // })
  }

  sendMail(result: any): void {
    let url = 'emailController/sendBehalfMail';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.notification.create('success', 'Success', "Observation email attachment has been sent successfully.");
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  openReminderCountHistoryModel() {
    let url = 'InProgController/getReminderHistory?deptCycleId=' + this.deptCycleId + '&stepUniqueName=' + this.stepUniqueName + '&obsId=' + this.obsId + '&reportCycle=' + this.reportCycle + '&status=' + this.status;
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

  openGPASenBackHistoryModel() {
    let _stepUniqueName=  encodeURIComponent(this.stepUniqueName);
    let url = 'InProgController/getRejectedReasons?deptCycleId=' + this.deptCycleId + '&stepUniqueName=' + _stepUniqueName + '&obsId=' + this.obsId + '&reportCycle=' + this.reportCycle + '&status=' + this.status;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(SendBackReasonsComponent, {
        width: '800px',
        data: response
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }


  openWorkingDepartmentOfObservation() {
    //  this.workItem.assignedDepartmentNames = "Corporate Planning ; Finance ; "
    let departmentsList = this.workItem.assignedDepartmentNames.split(' ; ');
    console.log(departmentsList)
    if (departmentsList[departmentsList.length - 1] == "") {
      departmentsList.pop(departmentsList.length - 1);
    }

    const dialogRef = this.dialog.open(WorkingDepartmentListComponent, {
      width: '500px',
      data: departmentsList
    });
  }

  sendReminder() {
    let url = `InProgController/sendReminder?sentByUserId=${this.userId}&wiIds=${this.id}`;
    if (this.selectedDelegateUserInfo) {
      url = url +'&isAdmin='+this.isAdmin + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url +'&isAdmin='+this.isAdmin  + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url +'&isAdmin='+this.isAdmin  + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }
    }
   
    //this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.getWorkItemInfo();
      this.notification.create('success', 'Success', "Reminder sent successfully");
    }, error => {
      this.getWorkItemInfo();
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }
  viewAttachment(responseId: any) {
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      // url = url + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      url = url + '&loginId=' + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }


    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let observation = {
        attachment: response.attachmens
      }
      const dialogRef = this.dialog.open(AttachmentListComponent, {
        data: observation
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }
  viewAttachmentForCycles(response: any) {

    let url = 'workItemController/getObsAttachments?obsId=' + this.obsId + '&cycleId=' + response.cycleId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      // let response = [{"docId":"0a3243f1-5dda-450f-988c-2f82a769c583","name":"تأخر انتهاء بعض مراحل مشروع الوقود البيئي حيث أشارت التوقعات لبعض الحزم أنه سيتم الانتهاء من تنفيذها في عام 2020 وكان مخطط له عام 2017، والبيان","createdDate":"2021-12-26 15:00:32.0","attachedBy":"ECMTest User2(ENG)"}]
      let observation = {
        attachment: response
      }
      const dialogRef = this.dialog.open(AttachmentListComponent, {
        data: observation
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }
prevObservation(workItem:any){
    if(this.isAdmin){

      this.router.navigate(['response-progress/work-item-details', this.selectedList[this.selectedIndex-1].stepCustomId],{ queryParams: {obsId: this.selectedList[this.selectedIndex-1].obsId, stepUnqName: this.selectedList[this.selectedIndex-1].stepUnqName,selectedIndex : this.selectedIndex -1}});
    }else{
      this.router.navigate(['response-progress/work-item-details', this.selectedList[this.selectedIndex-1].stepCustomId],{ queryParams: {obsId: this.selectedList[this.selectedIndex-1].obsId, stepUnqName: this.selectedList[this.selectedIndex-1].stepUnqName, pendingUser:this.selectedList[this.selectedIndex-1].pendingUser,selectedIndex : this.selectedIndex -1}});
    }
  }
  
  nextObservation(workItem:any){
    console.log(this.selectedList);
    console.log(this.selectedIndex)
    console.log(this.selectedIndex+1)
    console.log(this.selectedList[this.selectedIndex+1])
    console.log(this.selectedList[this.selectedIndex+1],this.selectedList,this.selectedIndex,"this.isAdmin");

    if(this.isAdmin){
      this.router.navigate(['response-progress/work-item-details', this.selectedList[this.selectedIndex+1].stepCustomId],{ queryParams: {obsId: this.selectedList[this.selectedIndex+1].obsId, stepUnqName: this.selectedList[this.selectedIndex+1].stepUnqName,selectedIndex : this.selectedIndex +1}});
    }else{
      this.router.navigate(['response-progress/work-item-details', this.selectedList[this.selectedIndex+1].stepCustomId],{ queryParams: {obsId: this.selectedList[this.selectedIndex+1].obsId, stepUnqName: this.selectedList[this.selectedIndex+1].stepUnqName, pendingUser:this.selectedList[this.selectedIndex+1].pendingUser,selectedIndex : this.selectedIndex +1}});
    }
  }
  onShowOverview(data: any) {
    

    let url = 'InProgController/getOverViewDetailsInfo?stepCustomId=' + this.id +'&stepUnqName='+this.stepUnqName+ '&userId=' + this.userId+ '&isAdmin=' + this.isAdmin + '&r=' + (Math.floor(Math.random() * 100) + 100);
   // let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => { 
      // remove
      //remove
    this._loading.setLoading(false, url);

    const dialogRef = this.dialog.open(OverviewComponent, {
      data: response
    });
  }, error => {
    //   // this.isDialogLoading = false;
    //   this._loading.setLoading(false, url);
    //   console.log('error :', error);
    })

  }


  onShowContactPerson(){
    //obsCategory ,deptName, deptCode
    let stepUnqName ='';
    if(this.workItem.stepUniqueName =='G&PA Park'){
      stepUnqName = 'GPAPark';
    }else if(this.workItem.stepUniqueName =='G&PAApprove-EditResponse'){
      stepUnqName = 'GPAApproveEditResponse';
    }else{
      stepUnqName = this.workItem.stepUniqueName;
    }

     let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode+'&reportCycle='+this.workItem.reportCycle+'&reportYear='+this.workItem.reportYear+'&obsId='+this.workItem.obsId+'&stepUnqName='+stepUnqName+'&pageName=Response';
   this._loading.setLoading(true, url);
   this.coreService.get(url).subscribe(response => {
     this._loading.setLoading(false, url);
    
     const dialogRef = this.dialog.open(ContactPersonDetailsComponent, {
       width: '900px',
       data: {
         dialogHeader: 'OBSERVATION_CONTACT',
         dialogData: response 
       }
     });
      dialogRef.afterClosed().subscribe((result:any) => {
        if (result.event == 'Send') {
     //     // this.updateGPAMemberDetails(result);
        }
      });
   }, error => {
   //   // this.isDialogLoading = false;
   //   this._loading.setLoading(false, url);
   //   console.log('error :', error);
   })
   
  }
  onReviewed(event:any): void {
    this.workItem.reviewed = event.checked? 'yes' :'no';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'REVIEWED',
        dialogMessage: 'ARE_YOU_SURE_YOU_REVIEWED_OBSERVATIONS'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onReviewed(event.checked);
      }else{
        this.workItem.reviewed = event.checked ? 'no' : 'yes';
      }
    });
  }

  _onReviewed(isChecked: boolean): void {
    let url = `InProgController/reviewObservation?stepCustomId=${this.id}&isReviewed=${isChecked? 'yes' :'no'}`
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.notification.create('success', 'Success', "G&PA TL review status updated successfully");
      this._loading.setLoading(false, url);
      this.getWorkItemInfo()
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.getWorkItemInfo()
      console.log('err  :', error);
    });
  }

  // added by venkat as per the specical request from g&pa need to remove this code once done
  onUpdateResponseByAdmin(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id + '&loginId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
    
      response.reportCycle = this.reportCycle;
      response.status = this.workItem.status;
      const dialogRef = this.dialog.open(UpdateResponseAdminComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.userInformation.sabMember.loginId;
        let isDelegatedUser = "false";
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = "true";
        } else if (this.userJobTitle == 'SEC') {
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        
        if (result.event == 'updateResponseByAdmin') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            draftResponse: result.data.editorData,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser,
            completionYear: result.data.completionYear,
            classification:result.data.classification,
            comment: result.data.comment,
            govtEntity:result.data.govtEntity
          }
          this._updateResponseByAdmin(draftData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }
  
  _updateResponseByAdmin(data: any) {
   // let url = 'workItemController/AddOrUpdateDraftResponse';
   let url = 'InProgController/UpdateResponseByAdmin';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      this._loading.setLoading(false, url);
	   this.router.navigate(['/response-progress']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }
  //end of update response by gpa
}
