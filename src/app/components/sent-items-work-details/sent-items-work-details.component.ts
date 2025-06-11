// import {  } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ApproveComponent } from '../approve/approve.component';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';
import { DepartmentTransferComponent } from '../department-transfer/department-transfer.component';
import { EmailDocumentComponent } from '../email-document/email-document.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { PastHistoryComponent } from '../past-history/past-history.component';
import { SendResponseBehalfComponent } from '../send-response-behalf/send-response-behalf.component';
import { SendResponseComponent } from '../send-response/send-response.component';
import { ContactPersonDetailsComponent } from '../contact-person-details/contact-person-details.component';
import { WorkingDepartmentListComponent } from '../working-department-list/working-department-list.component';

@Component({
  selector: 'app-sent-items-work-details',
  templateUrl: './sent-items-work-details.component.html',
  styleUrls: ['./sent-items-work-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SentItemsWorkDetailsComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'historyDate', 'stepName', 'responseTaken', 'from', 'to'];
  id: string;
  obsId: string;
  deptCycleId: string;
  workItem: any;
  loginId: string;
  isLoading: boolean = true;
  reportCycle: string
  // isDialogLoading: boolean;
  isRtl: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  userInformation: any;
  isAdmin: any;
  userJobTitle: any;
  departmentCode: any;
  userId: any;
  userName: any;
  isDateFieldSelected: boolean;
  mainUrl: any;
  seriousNotes: string = '';
  selectedDelegateUserInfo: any;
  selectedList:any =[];
  selectedIndex = 0;
  subscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private notification: NzNotificationService,
    private configService: ConfigService
  ) { 
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route.params.subscribe(params => {
          this.id = params['stepCustomId'];
        });
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
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.loginId = localStorage.getItem('loginId') || '';
    this.route.queryParams.subscribe(params => {
      // this.selectedIndex = parseInt(params['selectedIndex']);
      let temp:any = localStorage.getItem('selectedIndex')
      if(temp){
        this.selectedIndex =  JSON.parse(temp);
      }
      let selectedIndex = params['selectedIndex'];
      this.selectedIndex = +selectedIndex === 0 ? +selectedIndex : (+selectedIndex || this.selectedIndex);
      this.selectedList= localStorage.getItem('sentItems');
      if(this.selectedList){
        this.selectedList= JSON.parse(this.selectedList)
      }
    }
    );
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.departmentCode = this.userInformation.sabMember.departmentCode;
    this.userId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
   
  }

  getWorkItemInfo() {
    this.isLoading = true;
    let url = 'SentItemController/getSenItemDetails?stepCustomId=' + this.id + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.deptCycleId = response.deptCycleId;
      this.reportCycle = response.reportCycle;
      if (response.completionYear == 'متباين الرأى بشأنها' || response.completionYear == 'تتعلق بجهات حكومية/اخرى' || response.completionYear == 'Completed') {
        this.isDateFieldSelected = false;
      } else {
        this.isDateFieldSelected = true;
      }
      this.workItem = response;
      if(this.workItem.seriousNotes){
      this.seriousNotes = this.workItem.seriousNotes;
      }
      if (this.workItem.comments) {
        this.workItem.comments.map((data: any, index: any) => {
          let result = this.isArabic(data.comment);
          data.isArabic = result;
        })
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }


  isArabic(comment: string) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(comment)
    return result;
  }

  onAssignToExecutive(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getExecutiveUsers?r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let _response = {
        "execUsers": response,
        "activeAssignments": this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToExecutiveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var assignToExecData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            staffMemebers: result.data.selectedExecutives,
            userId: this.loginId
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
    let url = 'AssigmentsController/assignToExecutive';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onAssignToDept(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getDepartments?userId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&reportCycle=" + this.reportCycle;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let _result = {
        "directoratesList": response,
        "noOfActiveDepts": this.workItem.noOfActiveDepts
      }
      const dialogRef = this.dialog.open(DepartmentAssignmentComponent, {
        data: _result
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var assignToDeptData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            managers: result.data.selectedManagers
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
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onSendBack(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'SEND_BACK_FOR_CORRECTION',
        dialogMessage: 'ARE_YOU_SURE_SEND_BACK_OBSERVATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onsendBack();
      }
    });
  }

  _onsendBack(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/sendBack?stepCustomId=' + this.id + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  ondeclineAndSendBack(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DECLINE',
        dialogMessage: 'ARE_YOU_SURE_DECLINE_OBSERVATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._ondeclineAndSendBack();
      }
    });
  }

  _ondeclineAndSendBack(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/declineAndSendBack?stepCustomId=' + this.id + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  assignToCommittee(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getCommitteeUsers?r=' + (Math.floor(Math.random() * 100) + 100);
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&loginId=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      // url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userId + '&loginId=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      if (this.userJobTitle == 'SEC') {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&loginId=' + this.userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url  + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&loginId=' + this.userId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      let _response = {
        "committeeusers": response,
        "dialougeType": 'ASSIGN_TO_COMMITTEE'
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
          }else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            selectedFormatters: result.data.selectedFormatters,
            selectedHeads: result.data.selectedHeads,
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
    let url = 'AssigmentsController/assignToCommittee';
    this._loading.setLoading(true, url);
    this.coreService.post(url, JSON.stringify(result)).subscribe(Response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onAssignStaff(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getStaffMembers?managerUserId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&deptCycleId=" + this.deptCycleId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      var _input = {
        departmentData: response,
        dialougeType: 'ASSIGN_STAFF',
        // activeParticipants: this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToStaffComponent, {
        width: '800px',
        data: _input
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var assignToStaffData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            staffMemebers: result.data.selectedStaff
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
    let url = 'AssigmentsController/assignToStaff';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onRespondOnBehalf(): void {
    const dialogRef = this.dialog.open(SendResponseBehalfComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == 'Send') {
        var _response = {
          response: result.data.editorData,
          userId: this.loginId,
          stepId: this.id,
          loginId:this.loginId
        }
        this._respondOnBehalf(_response);
      }
    });
  }

  _respondOnBehalf(result: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/respondOnBehalf';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  sendToCEOAndMarkObsAsExcect(): void {
    // this.isDialogLoading = true;
    let url = 'AssigmentsController/sendToCEOAndMarkObsAsExec?stepCustomId=' + this.id + '&&userId=' + this.loginId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onApprove(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Send') {
          let _response = result.data.editorData;
          this._onApprove(_response);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  _onApprove(result: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/approveResponse?stepCustomId=' + this.id + '&stepResponse=' + result + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onApproveAndComine(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Send') {
          let _response = result.data.editorData;
          this._onApproveAndCombine(_response);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  _onApproveAndCombine(result: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/approveAndCombineResponse?stepCustomId=' + this.id + '&stepResponse=' + result + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onSendResponse(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(SendResponseComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event = 'Send') {
          let _response = result.data.editorData;
          this._sendResponse(_response);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  _sendResponse(result: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/sendResponse?stepCustomId=' + this.id + '&stepResponse=' + result + '&r=' + (Math.floor(Math.random() * 100) + 100);
    if (this.selectedDelegateUserInfo) {
      url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&loginId=' + this.userId;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&loginId=' + this.userId;
      } else {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&loginId=' + this.userId;
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(Response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
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
    let url = 'UserController/getDepartments?userId=' + this.loginId + "&obsId=" + this.obsId + "&stepCustomId=" + this.id + "&reportCycle=" + this.reportCycle;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(DepartmentTransferComponent, {
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Send') {
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var transferToDeptData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            managers: result.data.selectedManagers
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
    let url = 'AssigmentsController/tansferDepartment';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/sent-items']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
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
    this.onClickComment()
    // this.accordion.closeAll();
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

  onPastHistory(): void {
    let url = 'workItemController/getPastHistory?stepCustomId=' + this.id + '&obsId=' + this.obsId;
    url = url + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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

  exportToWord() {
    let url = 'ReportController/exportSentItem?stepCustomId=' + this.id;
    window.open(this.mainUrl + url, '_parent');
  }

  onEmailDocument(): void {
    // let url = 'UserController/getSabMembers';
    // this._loading.setLoading(true, url);
    // this.coreService.get(url).subscribe(response => {
    //   this._loading.setLoading(false, url);
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
            workItemId :this.id
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
  openWorkingDepartmentOfObservation() {
  //  this.workItem.assignedDepartmentNames = "Corporate Planning, Finance"
      let departmentsList = this.workItem.assignedDepartmentNames.split(' ; ')
      const dialogRef = this.dialog.open(WorkingDepartmentListComponent, {
        width: '500px',
        data: departmentsList
      });
  }

  viewAttachmentForCycles(response: any) {

    let url = 'workItemController/getObsAttachments?obsId=' + this.obsId +'&cycleId='+ response.cycleId;
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
viewAttachment(responseId: any) {

  let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {

      if (this.userJobTitle == 'SEC') {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&loginId=' + this.userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId + '&loginId=' + this.userId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }
      // url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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
prevObservation(){
  this.router.navigate(['sent-items/work-item-details', this.selectedList[this.selectedIndex-1]?.stepCustomId],{queryParams : {selectedIndex: this.selectedIndex -1}})
}
nextObservation(){
  this.router.navigate(['sent-items/work-item-details', this.selectedList[this.selectedIndex+1]?.stepCustomId],{queryParams : {selectedIndex: this.selectedIndex +1}})
}
onShowContactPerson(){
  
  let stepUnqName ='';
    if(this.workItem.stepUniqueName =='G&PA Park'){
      stepUnqName = 'GPAPark';
    }else if(this.workItem.stepUniqueName =='G&PAApprove-EditResponse'){
      stepUnqName = 'GPAApproveEditResponse';
    }else{
      stepUnqName = this.workItem.stepUniqueName;
    }
  //obsCategory ,deptName, deptCode
   let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode+'&reportCycle='+this.workItem.reportCycle+'&reportYear='+this.workItem.reportYear+'&obsId='+this.workItem.obsId+'&stepUnqName='+stepUnqName+'&pageName=Sent';
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
}
