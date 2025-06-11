import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { CoreService } from 'src/app/services/core.service';
import { SendBackReasonsComponent } from '../sendback-reasons/sendback-reasons.component';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ApproveComponent } from '../approve/approve.component';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DeclineSendBackComponent } from '../decline-send-back/decline-send-back.component';
import { DeclinedByManagerComponent } from '../declined-by-manager/declined-by-manager.component';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';
import { DepartmentTransferComponent } from '../department-transfer/department-transfer.component';
import { EmailDocumentComponent } from '../email-document/email-document.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { OtherResponsesComponent } from '../other-responses/other-responses.component';
import { PastHistoryComponent } from '../past-history/past-history.component';
import { SendBackComponent } from '../send-back/send-back.component';
import { SendResponseBehalfComponent } from '../send-response-behalf/send-response-behalf.component';
import { SendResponseComponent } from '../send-response/send-response.component';
import { ContactPersonDetailsComponent } from '../contact-person-details/contact-person-details.component';
import { OverviewComponent } from '../overview/overview.component';
import { WorkingDepartmentListComponent } from '../working-department-list/working-department-list.component';

export interface NatureType {
  value: string;
}

@Component({
  selector: 'app-workdetails',
  templateUrl: './workdetails.component.html',
  styleUrls: ['./workdetails.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class WorkdetailsComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'historyDate', 'stepName', 'responseTaken', 'from', 'to'];
  id: string;
  obsId: string;
  deptCycleId: string;
  workItem: any;
  test: string = '2342323';
  ex: boolean = false;
  loginId: string;
  panelOpenState = false;
  isLoading: boolean = true;
  natureBoxEnabled: boolean = false;
  notesBoxEnabled: boolean = false;
  reportCycle: string;
  actionType: string;
  // isDialogLoading: boolean;
  isRtl: any;
  natureType: NatureType[] = [
    { value: '' },
    { value: 'إجرائية' },
    { value: 'قانونية' },
    { value: 'مالية' },
    { value: 'بيئية' },
    { value: 'تعاقدية' },
    { value: 'فنية' },
    { value: 'طبيعة صناعة' },
    { value: 'اخرى' }
  ];
  selectedNature: string;
  userInformation: any;
  isAdmin: boolean = false;
  notesValue: string;
  gandpaNotes: string = '';
  isReviewEnabled= false;
  // notesData = [
  //   { date: '18/07/2021', loginId: 'ECMTEST_HR_ENG', notes: 'Test notes data' },
  //   { date: '18/07/2021', loginId: 'ECMTEST_HR_ENG', notes: 'Test notes data' },
  //   { date: '18/07/2021', loginId: 'ECMTEST_HR_ENG', notes: 'Test notes data' },
  //   { date: '18/07/2021', loginId: 'ECMTEST_HR_ENG', notes: 'Test notes data' },
  // ]
  @ViewChild(MatAccordion) accordion: MatAccordion;
  userJobTitle: any;
  departmentCode: any;
  selectedDelegateUserInfo: any;
  userId: any;
  isSpecialCondition: boolean ;
  otherNature: string = '';
  stepUniqueName: any;
  obsCategory: any;
  noOfActiveDepts: any = 0;
  approveEnabled: any;
  isSpecialNatureSpecialCondition: boolean;
  isCommittee: boolean ;
  selectedList:any =[];
  selectedIndex = 0;
  subscription: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private notification: NzNotificationService,
    private _loading: LoadingService
  ) { 
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { 
        this.route.params.subscribe(params => {
          this.id = params['stepCustomId'];
        });
        console.log('router subscribe is called here');
        let data: any = localStorage.getItem('sabUserInformation');
        this.userInformation = JSON.parse(data);
        this.isAdmin = this.userInformation.admin;
        this.getWorkItemInfo();
      //  this.getWorkItemInfo();
      }
    });
   }
   ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    console.log('ngOnInit  is called here');
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.loginId = localStorage.getItem('loginId') || '';

    this.route.queryParams.subscribe(params => {
      // this.selectedIndex = parseInt(params['selectedIndex']);
      let temp:any = localStorage.getItem('selectedIndex')
      if(temp){
        this.selectedIndex =  JSON.parse(temp);
      }
      let selectedIndex = params['selectedIndex'];
      this.selectedIndex = +selectedIndex === 0 ? +selectedIndex : (+selectedIndex || this.selectedIndex);
      this.selectedList= localStorage.getItem('inboxItems');
      if(this.selectedList){
        this.selectedList= JSON.parse(this.selectedList)
      }
    }
    );
    // this.selectedNature = this.natureType[0].value;
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.departmentCode = this.userInformation.sabMember.directorateCode;
    this.userId = this.userInformation.sabMember.loginId;
    this.loginId = this.userInformation.sabMember.loginId;
    if (this.userInformation.canReviewObservations) {
      this.isReviewEnabled= true;
    }
    this.getWorkItemInfo();
  }

  getWorkItemInfo() {
    this.isLoading = true;
    let url = 'workItemController/getWorkDetailsInfo?stepCustomId=' + this.id + '&isAdmin=' + this.isAdmin + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
//--remove
//--remove
if(this.isReviewEnabled && !(response.stepUniqueName=='G&PA Park' || response.stepUniqueName=='G&PAApprove' || response.stepUniqueName=='G&PAApprove-EditResponse' 
     || response.stepUniqueName=='G&PACOombineResponse' || response.stepUniqueName=='NORMAL-DCEO-OR-CEO-APPROVAL' )){
this. isReviewEnabled = false;
     }
    

      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.deptCycleId = response.deptCycleId;
      this.reportCycle = response.reportCycle;
      // this.actionType = response.actionType;
      this.stepUniqueName = response.stepUniqueName;
      this.obsCategory = response.obsCategory;
      this.noOfActiveDepts = response.noOfActiveDepts;
      this.approveEnabled = response.completeObservationEnabled;
      this.workItem = response;
      if (response.impactNature) {
        let isNatureMatched = false;
        this.natureType = this.natureType.slice(1);
        this.natureType.map((nature, index) => {
          if (nature.value == response.impactNature) {
            isNatureMatched = true;
            this.selectedNature = this.natureType[index].value;
          }
        });
        if (!isNatureMatched) {
          this.otherNature = response.impactNature;
          this.selectedNature = this.natureType[this.natureType.length - 1].value;
        }
      } else {
        this.selectedNature = this.natureType[0].value;
      }
      // this.workItem.callDate = "2022-01-24 11:02:58"
      if (this.workItem.callDate) {
        var callDate = new Date(this.workItem.callDate);
        callDate.setDate(callDate.getDate());
        callDate.setHours(0, 0, 0, 0);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        //this.isCommittee = true;
        //console.log( today  +  "  >= " + callDate )
        
        if (today >= callDate) {
          if (this.obsCategory == 'Normal') {
            if (this.isAdmin) {
              this.isSpecialCondition = false;
            } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG' || this.userJobTitle == 'SEC') {
              if (this.workItem.isGpaSentBack) {
                let gpaSendBackDate = new Date(this.workItem.gpaSendBackDate);
                gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1);
                gpaSendBackDate.setHours(0, 0, 0, 0);
                if (today <= gpaSendBackDate) {
                } else {
                  this.isSpecialCondition = true;
                }
              } else {
                this.isSpecialCondition = true;
              }
            }
          } else 
          if (this.obsCategory == 'Special Nature') {
            if (this.isAdmin) {
              this.isSpecialNatureSpecialCondition = false;
            } else if (this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'CEO' || this.userJobTitle == 'DCEO' || this.userJobTitle == 'SEC') {

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
          else if (this.obsCategory == 'Committee') {
            if(this.isAdmin){
              this.isCommittee = false //true
            }else if(this.userJobTitle == 'CEO' || this.userJobTitle == 'DCEO' || this.userJobTitle == 'SEC' ){
              if (this.workItem.isGpaSentBack) {
                let gpaSendBackDate = new Date(this.workItem.gpaSendBackDate);
                gpaSendBackDate.setDate(gpaSendBackDate.getDate() + 1); //23
                gpaSendBackDate.setHours(0, 0, 0, 0);
                if (today <= gpaSendBackDate) {
                  // DO nothing
                } else {
                  this.isCommittee = true; 
                }
              }else{
                this.isCommittee = true
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
      if (this.workItem.stepUniqueName == 'G&PAReview' && this.workItem.reportCycle != 'KNPC Response Report') {
        this.notesBoxEnabled = true;
      }
      if (this.workItem.status == 'Pending G&PA Approval' && this.workItem.reportCycle != 'KNPC Response Report') {
        this.natureBoxEnabled = true;
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
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


  isArabic(comment: string) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(comment)
    return result;
  }

  showHistory(): void {
    this.test = 'insid showHistory';
  }

  onAssignToExecutive(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getExecutiveUsers';
    if (this.selectedDelegateUserInfo) {
      url = url + '?isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&operationType=Assign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&operationType=Assign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);

      } else {
        url = url + '?isDelegatedUser=false&onBehalfOf=' + this.userId + '&operationType=Assign' + '&deptCycleId=' + this.deptCycleId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);

      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let _response = {
        "execUsers": response,
        "dialougeType": 'Assign',
        "activeParticipants": this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToExecutiveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
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
    let url = 'AssigmentsController/assignToExecutive';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onAssignToDept(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getDepartments?obsId=' + this.obsId + '&stepCustomId=' + this.id + '&reportCycle=' + this.reportCycle + '&userId=';
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
          let _onBehalf = this.loginId;
          let isDelegatedUser = false;
          if (this.selectedDelegateUserInfo) {
            _onBehalf = this.selectedDelegateUserInfo.loginId;
            isDelegatedUser = true;
          } else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var assignToDeptData = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            managers: result.data.selectedManagers,
            userId: this.loginId,
            userJobTitle: this.userJobTitle,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
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
    let url = 'AssigmentsController/assignToDepartments';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.getUserInfo();
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onDeclinedByManager(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getDepartments?actionType=Decline&obsId=' + this.obsId + '&stepCustomId=' + this.id + '&reportCycle=' + this.reportCycle + '&userId=';
    // let url = 'UserController/getDepartments?obsId=' + this.obsId + '&stepCustomId=' + this.id + '&reportCycle=' + this.reportCycle + '&userId=';
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
      // response =  [{"directorateName":"Deputy C.E.O. For Admin. & Commercial","managersList":[{"departmentName":"Human Resources","loginId":"ECMTEST_HR_MGR","userName":"HR Manager","departmentCode":106300,"directorateName":"Deputy C.E.O. For Admin. & Commercial","userTitle":"Manager, Human Resource","userjobTitle":"MGR","directorateCode":101320,"checked":false},{"departmentName":"Commercial","loginId":"ECMTEST_COMM_MGR","userName":"Commercial Manager","departmentCode":104100,"directorateName":"Deputy C.E.O. For Admin. & Commercial","userTitle":"Manager, Commercial","userjobTitle":"MGR","directorateCode":101320,"checked":false}]},{"directorateName":"Chief Executive Officer's Office","managersList":[{"departmentName":"Corporate Legal","loginId":"ECMTEST_HSE_MGR","userName":"Corporate Legal Manager","departmentCode":102010,"directorateName":"Chief Executive Officer's Office","userTitle":"Manager, Corporate Legal","userjobTitle":"MGR","directorateCode":101010,"checked":false}]},{"directorateName":"Deputy C.E.O. For Projects","managersList":[{"departmentName":"Projects (CFP)","loginId":"ECMTEST_SHU_MGR","userName":"CFP Manager","departmentCode":701010,"directorateName":"Deputy C.E.O. For Projects","userTitle":"Manager, CFP","userjobTitle":"MGR","directorateCode":101270,"checked":false}]},{"directorateName":"Deputy C.E.O. For Support Services","managersList":[{"departmentName":"Information Technology","loginId":"ECMTEST_IT_MGR","userName":"IT Manager","departmentCode":196100,"directorateName":"Deputy C.E.O. For Support Services","userTitle":"Manager, Information Technology","userjobTitle":"MGR","directorateCode":101280,"checked":false}]},{"directorateName":"Deputy C.E.O. For Fuel Supply Operations","managersList":[{"departmentName":"Local Marketing","loginId":"ECMTEST_MGR_LM","userName":"LMD Manager","departmentCode":117010,"directorateName":"Deputy C.E.O. For Fuel Supply Operations","userTitle":"Manager, Local Marketing","userjobTitle":"MGR","directorateCode":101210,"checked":false}]},{"directorateName":"Deputy C.E.O. For MAB Ref.","managersList":[{"departmentName":"Quality Assurance - MAB","loginId":"ECMTEST_MAB_QA_MGR","userName":"Quality Assurance (MAB) Manager","departmentCode":311010,"directorateName":"Deputy C.E.O. For MAB Ref.","userTitle":"Manager, Quality Assurance (MAB)","userjobTitle":"MGR","directorateCode":101230,"checked":false},{"departmentName":"Technical Services - MAB","loginId":"ECMTEST_MAB_TECH_MGR","userName":"Technical Services (MAB) Manager","departmentCode":304010,"directorateName":"Deputy C.E.O. For MAB Ref.","userTitle":"Manager, Technical Services (MAB)","userjobTitle":"MGR","directorateCode":101230,"checked":false}]},{"directorateName":"Deputy C.E.O. For Planning & Finance","managersList":[{"departmentName":"Finance","loginId":"ECMTEST_FIN_MGR","userName":"Finance Manager","departmentCode":113100,"directorateName":"Deputy C.E.O. For Planning & Finance","userTitle":"Manager, Finance","userjobTitle":"MGR","directorateCode":101330,"checked":false},{"departmentName":"Corporate Planning","loginId":"ECMTEST_MGR_CP","userName":"CPD Manager","departmentCode":103010,"directorateName":"Deputy C.E.O. For Planning & Finance","userTitle":"Manager, Corporate Planning","userjobTitle":"MGR","directorateCode":101330,"checked":false},{"departmentName":"Manufacturing Optimization Group (MOG)","loginId":"ECMTEST_MGR_MO","userName":"MOG Manager","departmentCode":180200,"directorateName":"Deputy C.E.O. For Planning & Finance","userTitle":"Manager, Manufacturing Optimization Group","userjobTitle":"MGR","directorateCode":101330,"checked":false}]},{"directorateName":"Deputy C.E.O. For MAA Ref.","managersList":[{"departmentName":"Quality Assurance - MAA","loginId":"ECMTEST_MAA_QA_MGR","userName":"Quality Assurance (MAA) Manager","departmentCode":411010,"directorateName":"Deputy C.E.O. For MAA Ref.","userTitle":"Manager, Quality Assurance (MAA)","userjobTitle":"MGR","directorateCode":101240,"checked":false}]}]
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      let _result = {
        "directoratesList": response,
        "noOfActiveDepts": this.workItem.noOfActiveDepts,
        "deprtment": this.workItem.departmentName
      }
      const dialogRef = this.dialog.open(DeclinedByManagerComponent, {
        width: '750px',
        data: _result
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          let _onBehalf = this.loginId;
          let isDelegatedUser = false;
          if (this.selectedDelegateUserInfo) {
            _onBehalf = this.selectedDelegateUserInfo.loginId;
            isDelegatedUser = true;
          } else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          // var stepIds: Array<string> = [];
          // stepIds.push(this.id);
          var assignToDeptData = {
            stepCustomIds: this.id,
            groupComment: result.data.groupComment,
            managers: result.data.selectedManagers,
          }
          console.log(result.data.groupComment)
          this.declinedByManager(assignToDeptData);
        }
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  declinedByManager(result: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/declineDepartment?suggestedDepartment=' + result.managers + '&stepCustomId=' + this.id + '&comment=' + result.groupComment + '&isAdmin=false&userLogin=';
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
      this._loading.setLoading(false, url);
      this.getUserInfo();
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }
  onSendBackAfterEdit(): void {
   
    var wid, height;
    if (this.isAdmin) {
      wid = '600px'
      height = '416px'
    } else {
      wid = '400px'
      height = 'auto'
    }
    const dialogRef = this.dialog.open(SendBackComponent, {
      width: wid,
      height: height
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _response = result.data;
        this._onsendBackAfterEdit(_response);
      }
    });
  }
  _onsendBackAfterEdit(data: any): void {
    let url = 'workItemController/sendBackAfterEdit?stepCustomId=' + this.id;
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
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  onSendBack(): void {
    // if (this.workItem.stepUniqueName == 'G&PAReview-wrong' || this.workItem.stepUniqueName == 'G&PAAproval-Combine-wrong') {
    //   const dialogRef = this.dialog.open(SendBackComponent, {
    //     width: '400px'
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result.event == 'Send') {
    //       let _response = result.data;
    //       this._onsendBack(_response);
    //     }
    //   });
    // } else {
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     width: '400px',
    //     data: {
    //       dialogHeader: 'SEND_BACK_FOR_CORRECTION',
    //       dialogMessage: 'ARE_YOU_SURE_SEND_BACK_OBSERVATION'
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this._onsendBack(result);
    //     }
    //   });
    // }
    var wid, height;
    if (this.isAdmin) {
      wid = '600px'
      height = '416px'
    } else {
      wid = '400px'
      height = 'auto'
    }
    const dialogRef = this.dialog.open(SendBackComponent, {
      width: wid,
      height: height
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _response = result.data;
        this._onsendBack(_response);
      }
    });
  }

  _onsendBack(data: any): void {
    let url = 'workItemController/sendBack?stepCustomId=' + this.id;
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
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  ondeclineAndSendBack(): void {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     dialogHeader: 'DECLINE_AND_SEND_BACK',
    //     dialogMessage: 'ARE_YOU_SURE_DECLINE_OBSERVATION'
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this._ondeclineAndSendBack();
    //   }
    // });
    const dialogRef = this.dialog.open(DeclineSendBackComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _response = result.data;
        this._ondeclineAndSendBack(_response);
      }
    });
  }

  _ondeclineAndSendBack(data: any): void {
    // this.isDialogLoading = true;
    // let url = 'workItemController/declineAndSendBack?stepCustomId=' + this.id + "&comment=" + data.comment + "&r=" + (Math.floor(Math.random() * 100) + 100);
    let url = 'workItemController/declineAndSendBack?stepCustomId=' + this.id + "&comment=" + encodeURIComponent(data.comment.trim());
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }
    }
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  assignToCommittee(): void {
    // this.isDialogLoading = true;
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
    let url = 'AssigmentsController/assignToCommittee';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(Response => {
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onAssignStaff(): void {
    // this.isDialogLoading = true;
    let url = 'UserController/getStaffMembers?obsId=' + this.obsId + '&stepCustomId=' + this.id + '&deptCycleId=' + this.deptCycleId + '&operationType=Assign' + '&userId=';
    if (this.selectedDelegateUserInfo) {
      // url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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
      var _input = {
        departmentData: response,
        dialougeType: 'ASSIGN_STAFF',
        activeParticipants: this.workItem.activeAssignments
      };
      const dialogRef = this.dialog.open(AssignToStaffComponent, {
        width: '800px',
        data: _input
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          let _onBehalf = this.loginId;
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
            staffMemebers: result.data.selectedStaff,
            userId: this.loginId,
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
    let url = 'AssigmentsController/assignToStaff';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onRespondOnBehalf(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      // url = url + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      response.status = this.workItem.status;
      const dialogRef = this.dialog.open(SendResponseBehalfComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
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
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('attach', result.data.attach);
          formData.append('userId', this.loginId);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          formData.append('logInId', this.userInformation.sabMember.loginId);
          formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
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
            classification:result.data.classification
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
    let url = 'workItemController/respondOnBehalf';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    })
  }

  onSendToCeo(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'ASSIGN_TO_CEO',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_ASSIGN_THIS_OBSERVATION_TO_CEO'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        this.sendToCEOAndMarkObsAsExcect(result.data);
      }
    });
  }

  sendToCEOAndMarkObsAsExcect(comment: any): void {

    // this.isDialogLoading = true;
    let url = 'AssigmentsController/sendToCEOAndMarkObsAsExec?stepCustomId=' + this.id + '&userId=';
    if (this.selectedDelegateUserInfo) {
      // url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }

    url = url + '&comment=' + encodeURI(comment.comment)
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onCompleteObs(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      // url = url + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      url = url + '&loginId=' + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }


    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      // response = {"obsResponse":"<p>الخليج التأمين بتحديد شروط جديدة على التمديد شملت جميع وحدات المشروع وذلك لعدم تغطيتها بعض العمليات الحيوية للوحدات كبدء التشغيل وعمل اختبار الأداء للوحدات والتشغيل التجاري والذي يعد من أهم العمليات الحيوية خلال فترة تشغيل المشروع وكذلك عدم وجود غطاء تأميني للأمطار والفيضانات المستقبلية ويرجع ذلك إلى ارتفاع قيمة المطالبات التأمينية الضخمة التي قدمها مقاولي المشروع والخاصة بأمطار نوفمبر 2018، وبالإضافة إلى ذلك وضعت مجموعة الخليج للتأمين شروط واستثناءات لبعض الوحدات وصلت إلى عدد (15) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وتنص \"بأن يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغطية التأمينية أو عمل التسوية بين الطرفين\" وصل إجماليها إلى عدد (60) وحدة منها (21) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وعدد (39) وحدة في حزمة مصفاة الأحمدي</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KOC, KGOC","completionYear":"2023-2024","type":"success","attachmens":[],"obsSeq":0}

      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      response.stepUniqueName = this.stepUniqueName;
      if (this.workItem.stepUniqueName == 'NORMAL-DCEO-OR-CEO-APPROVAL') {
        response.approveEnabled = false;
      } else {
        response.approveEnabled = this.approveEnabled;
      }

      if (this.workItem.stepUniqueName == 'G&PAApprove-EditResponse') {
        response.isEditable = true;
      } else {
        response.isEditable = false;
      }
      //response = {"obsResponse":"<p>AAAAAAAA</p>","obsType":"REPEATED","type":"success","attachmens":[{"docId":"0a3243f1-5dda-450f-988c-2f82a769c583","name":"Memo Attachment 4.pdf","createdDate":"2021-12-26 15:00:32.0","attachedBy":"ECMTest User2(ENG)"}]}

      let _response = {
        "responseData": response,
        "dialogueType": 'APPROVE'
      };
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
        let isDelegatedUser = "false";
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = "true";
        }
        if (result.event == 'Send') {
          let _onBehalf = this.loginId;
          let isDelegatedUser = "false";
          if (this.selectedDelegateUserInfo) {
            _onBehalf = this.selectedDelegateUserInfo.loginId;
            isDelegatedUser = "true";
          } else if (this.userJobTitle == 'SEC') {
            _onBehalf = this.userInformation.supervisorDetails.loginId;
          }
          let formData: FormData = new FormData();
          formData.append('stepCustomId', this.id);
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('reson', result.data.reson);
          formData.append('attach', result.data.attach);
          formData.append('attachmentName', result.data.attachmentName);
          formData.append('userJobTitle', this.userJobTitle);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          formData.append('logInId', this.userInformation.sabMember.loginId);
          formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          if (result.data.entity) {
            formData.append('entity', result.data.entity);
          }
          if (result.data.isSkipMail) {
            formData.append('isSkipMail', result.data.isSkipMail);
          }
          if (this.isAdmin) {
            if (this.selectedNature == 'اخرى') {
              formData.append('nature', this.otherNature);
            } else {
              formData.append('nature', this.selectedNature);
            }
            formData.append('notes', this.workItem.notes);
          }
          /** 
          if (this.workItem.stepUniqueName == 'G&PAApprove-EditResponse') {
            formData.append('entity', this.workItem.entity);
          }
          **/
          this._onCompleteObs(formData);
        }
        if (result.event == 'draft') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            logInId: this.userInformation.sabMember.loginId,
            draftResponse: result.data.editorData,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser,
            completionYear: result.data.completionYear
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

  _onCompleteObs(data: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/completeObservation';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onReview(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
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
      response.reportCycle = this.reportCycle;
      response.stepUniqueName = this.stepUniqueName;
      response.approveEnabled = this.approveEnabled;
      let _response = {
        "responseData": response,
        "dialogueType": 'REVIEW'
      };
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
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
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('attach', result.data.attach);
          formData.append('attachmentName', result.data.attachmentName);
          formData.append('userJobTitle', this.userJobTitle);
          formData.append('actionName', 'Review');
          formData.append('logInId', this.userInformation.sabMember.loginId);
          formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          if (this.selectedDelegateUserInfo) {
            formData.append('onBhalfOf', this.selectedDelegateUserInfo.loginId);
            formData.append('isDelegatedUser', 'true');
          }
          if (this.isAdmin) {
            if (this.selectedNature == 'اخرى') {
              formData.append('nature', this.otherNature);
            } else {
              formData.append('nature', this.selectedNature);
            }
            formData.append('notes', this.workItem.notes);
          }
          this._onApprove(formData);
        }
        if (result.event == 'draft') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            draftResponse: result.data.editorData,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser,
            completionYear: result.data.completionYear
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

  onEditResponse(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'Edit Response',
        dialogMessage: 'ARE_YOU_SURE_EDIT_RESPONSE_OBSERVATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onEditResponse();
      }
    });
  }

  _onEditResponse(): void {
    // this.isDialogLoading = true;
    // this.userJobTitle = 'weewe';
    // this.departmentCode = 2323;
    let url = 'InProgController/editResponse?stepCustomId=' + this.id + '&departmentCode=' + this.departmentCode + '&userJobTitle=' + this.userJobTitle + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin + "&r=" + (Math.floor(Math.random() * 100) + 100);
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

  onApprove(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {

      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&loginId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      // response = {"obsResponse":"<p>الخليج التأمين بتحديد شروط جديدة على التمديد شملت جميع وحدات المشروع وذلك لعدم تغطيتها بعض العمليات الحيوية للوحدات كبدء التشغيل وعمل اختبار الأداء للوحدات والتشغيل التجاري والذي يعد من أهم العمليات الحيوية خلال فترة تشغيل المشروع وكذلك عدم وجود غطاء تأميني للأمطار والفيضانات المستقبلية ويرجع ذلك إلى ارتفاع قيمة المطالبات التأمينية الضخمة التي قدمها مقاولي المشروع والخاصة بأمطار نوفمبر 2018، وبالإضافة إلى ذلك وضعت مجموعة الخليج للتأمين شروط واستثناءات لبعض الوحدات وصلت إلى عدد (15) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وتنص \"بأن يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغطية التأمينية أو عمل التسوية بين الطرفين\" وصل إجماليها إلى عدد (60) وحدة منها (21) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وعدد (39) وحدة في حزمة مصفاة الأحمدي</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KOC, KGOC","completionYear":"2023-2024","type":"success","attachmens":[],"obsSeq":0}
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      response.stepUniqueName = this.stepUniqueName;
      // response.approveEnabled = this.approveEnabled;
      //  if((this.workItem.stepUniqueName == 'G&PAApprove' || this.workItem.stepUniqueName == 'G&PAReview') && this.workItem.noOfActiveDepts==1){
      // if it is normal observation and assigned to single department then classification option is visible
      if ((this.workItem.stepUniqueName == 'G&PAApprove' || this.workItem.stepUniqueName == 'G&PAReview')) {
        response.approveEnabled = true;
      } else {
        response.approveEnabled = this.approveEnabled;
      }
      if (this.workItem.stepUniqueName == 'G&PAApprove-EditResponse') {
        response.isEditable = true;
      } else {
        response.isEditable = false;
      }
      let dialogueType;
      if (this.workItem.gpaAproveAndCombineEnabled) {
        dialogueType = 'APPROVE_AND_COMBINE_RESPONSE';
      } else {
        dialogueType = 'APPROVE';
      }
      let _response = {
        "responseData": response,
        "dialogueType": dialogueType
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
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('attach', result.data.attach);
          formData.append('attachmentName', result.data.attachmentName);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          if (result.data.completionYear) {
            formData.append('completionYear', result.data.completionYear);
          }
          if (result.data.classification) {
            formData.append('classification', result.data.classification);
          }
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          if (this.isAdmin) {
            if (this.selectedNature == 'اخرى') {
              formData.append('nature', this.otherNature);
            } else {
              formData.append('nature', this.selectedNature);
            }
            formData.append('notes', this.workItem.notes);
          }
          if (this.workItem.stepUniqueName == 'G&PAApprove-EditResponse') {
            formData.append('entity', this.workItem.entity);
          }
          console.log(this.userInformation.sabMember)
          formData.append('logInId', this.userInformation.sabMember.loginId);
          formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
          this._onApprove(formData);
        }
        if (result.event == 'draft') {
          let draftData = {
            workItemId: this.id,
            userId: this.userId,
            draftResponse: result.data.editorData,
            onBhalfOf: _onBehalf,
            logInId: this.userInformation.sabMember.loginId,
            delegatedUser: isDelegatedUser,
            completionYear: result.data.completionYear
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
    let url = 'workItemController/approveResponse';
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
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

  onApproveAndComine(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
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
      // this.isDialogLoading = false;
      // response = {"obsResponse":"<p>الخليج التأمين بتحديد شروط جديدة على التمديد شملت جميع وحدات المشروع وذلك لعدم تغطيتها بعض العمليات الحيوية للوحدات كبدء التشغيل وعمل اختبار الأداء للوحدات والتشغيل التجاري والذي يعد من أهم العمليات الحيوية خلال فترة تشغيل المشروع وكذلك عدم وجود غطاء تأميني للأمطار والفيضانات المستقبلية ويرجع ذلك إلى ارتفاع قيمة المطالبات التأمينية الضخمة التي قدمها مقاولي المشروع والخاصة بأمطار نوفمبر 2018، وبالإضافة إلى ذلك وضعت مجموعة الخليج للتأمين شروط واستثناءات لبعض الوحدات وصلت إلى عدد (15) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وتنص \"بأن يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغطية التأمينية أو عمل التسوية بين الطرفين\" وصل إجماليها إلى عدد (60) وحدة منها (21) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وعدد (39) وحدة في حزمة مصفاة الأحمدي</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KOC, KGOC","completionYear":"2023-2024","type":"success","attachmens":[],"obsSeq":0};
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      response.stepUniqueName = this.stepUniqueName;
      response.approveEnabled = this.approveEnabled;
      let _response = {
        "responseData": response,
        "dialogueType": 'APPROVE_AND_COMBINE_RESPONSE'
      };
      const dialogRef = this.dialog.open(ApproveComponent, {
        width: '800px',
        data: _response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
        let isDelegatedUser = "false";
        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          isDelegatedUser = "true";
        } else if (this.userJobTitle == 'SEC') {
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        if (result.event == 'Send') {
          if (result.event == 'Send') {
            let _onBehalf = this.loginId;
            let isDelegatedUser = "false";
            if (this.selectedDelegateUserInfo) {
              _onBehalf = this.selectedDelegateUserInfo.loginId;
              isDelegatedUser = "true";
            } else if (this.userJobTitle == 'SEC') {
              _onBehalf = this.userInformation.supervisorDetails.loginId;
            }
            let formData: FormData = new FormData();
            formData.append('stepCustomId', this.id);
            formData.append('stepResponse', result.data.editorData);
            formData.append('comment', result.data.comment);
            formData.append('attach', result.data.attach);
            formData.append('attachmentName', result.data.attachmentName);
            formData.append('onBhalfOf', _onBehalf);
            formData.append('delegatedUser', isDelegatedUser);
            if (this.isAdmin) {
              if (this.selectedNature == 'اخرى') {
                formData.append('nature', this.otherNature);
              } else {
                formData.append('nature', this.selectedNature);
              }
              formData.append('notes', this.workItem.notes);
            }
            if (result.data.completionYear) {
              formData.append('completionYear', result.data.completionYear);
            }
            if (result.data.classification) {
              formData.append('classification', result.data.classification);
            }
            if (result.data.govtEntity) {
              formData.append('govtEntity', result.data.govtEntity);
            }
            formData.append('logInId', this.userInformation.sabMember.loginId);
            formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
            this._onApproveAndCombine(formData);
          }
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
    });
  }

  _onApproveAndCombine(data: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/approveAndCombineResponse';
    // let url = 'workItemController/approveAndCombineResponse?stepCustomId=' + this.id + '&stepResponse=' + result + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onSendResponse(): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    console.log(this.selectedDelegateUserInfo, 'selectedDelegateUserInfo 1')
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&loginId=' + this.userId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;

      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      const dialogRef = this.dialog.open(SendResponseComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        let _onBehalf = this.loginId;
        let isDelegatedUser = "false";

        // console.log(this.selectedDelegateUserInfo,'selectedDelegateUserInfo 2')
        // let userJobTitle = this.selectedDelegateUserInfo.userjobTitle


        let userJobTitle = this.userJobTitle;

        if (this.selectedDelegateUserInfo) {
          _onBehalf = this.selectedDelegateUserInfo.loginId;
          userJobTitle = this.selectedDelegateUserInfo.userJobTitle;
          isDelegatedUser = "true";
        } else if (this.userJobTitle == 'SEC') {
          userJobTitle = this.userJobTitle;
          _onBehalf = this.userInformation.supervisorDetails.loginId;
        }
        if (result.event == 'Send') {
          let formData: FormData = new FormData();
          formData.append('stepCustomId', this.id);
          formData.append('stepResponse', result.data.editorData);
          formData.append('comment', result.data.comment);
          formData.append('completionYear', result.data.completionYear);
          formData.append('classification', result.data.classification);
          formData.append('attach', result.data.attach);
          formData.append('onBhalfOf', _onBehalf);
          formData.append('delegatedUser', isDelegatedUser);
          formData.append('logInId', this.userInformation.sabMember.loginId);
          formData.append('userJobTitle', this.userInformation.sabMember.userJobTitle);
          if (result.data.govtEntity) {
            formData.append('govtEntity', result.data.govtEntity);
          }
          this._sendResponse(formData);
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

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'CANCEL',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_REMOVE_THIS_OBSERVATION_DECLINED_BY',
        name: this.workItem.senderUserName
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
    let url = 'workItemController/cancelObservation?stepCustomId=' + this.id + '&departmentCode=' + this.userInformation.sabMember.departmentCode + '&comment=' + encodeURIComponent(result.data.comment) + '&userLogin=' + this.loginId + '&isAdmin=' + this.isAdmin;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }
    }
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  _sendResponse(data: any): void {
    // this.isDialogLoading = true;
    let url = 'workItemController/sendResponse?'

    if (this.selectedDelegateUserInfo) {
      url = url + 'loginId=' + this.userInformation.sabMember.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + 'loginId=' + this.userInformation.sabMember.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + 'loginId=' + this.userInformation.sabMember.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
      }
    }
    url = url + "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
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
        let url = 'UserController/getDepartments?obsId=' + this.obsId + '&stepCustomId=' + this.id + '&actionType=share&reportCycle=' + this.reportCycle + '&userId=';
        if (this.selectedDelegateUserInfo) {
          // url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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
              let _onBehalf = this.loginId;
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
      this.router.navigate(['/inbox']);
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
        let url = 'UserController/getDepartments?obsId=' + this.obsId + '&stepCustomId=' + this.id + '&actionType=transfer&reportCycle=' + this.reportCycle + '&userId=';
        if (this.selectedDelegateUserInfo) {
          // url = url + this.selectedDelegateUserInfo.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.userId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
          url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
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
              let _onBehalf = this.loginId;
              let isDelegatedUser = false;
              if (this.selectedDelegateUserInfo) {
                _onBehalf = this.selectedDelegateUserInfo.loginId;
                isDelegatedUser = true;
              }
              if (this.userJobTitle == 'SEC') {
                _onBehalf = this.userInformation.supervisorDetails.loginId
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
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  onOtherResponses(): void {
    let url = 'workItemController/getOtherDepartmentResponses?obsId=' + this.obsId + '&deptCycleId=' + this.deptCycleId + '&stepCustomId=' + this.id + '&reportCycle=' + this.reportCycle + '&userId=';
    if (this.selectedDelegateUserInfo) {
      url = url + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
      }

    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      const dialogRef = this.dialog.open(OtherResponsesComponent, {
        width: '800px',
        data: response
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Send') {
          let _response = result.data;
          this._onsendBack(_response);
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  getUserInfo() {
    let url = 'UserController/getUserInfo?r=' + (Math.floor(Math.random() * 100) + 100);
    this.coreService.get(url).subscribe((result: any) => {
      this.sharedVariableService.setValue(result.inboxCount);
    }, error => {
      console.log('error  :', error);
    })
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
    let url = 'InProgController/saveNotes?obsId=' + this.obsId + '&userId=' + this.userId + '&departmentName=' + this.workItem.departmentName + '&cycleId=' + this.workItem.deptCycleId+'&stepUniqName='+stepUnqName + '&seriousNotes=&notes=' + this.gandpaNotes;
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

  onPastHistory(): void {
    // this.isDialogLoading = true;
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
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      const dialogRef = this.dialog.open(PastHistoryComponent, {
        width: '800px',
        data: response
      });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result.event == 'Send') {
      //     let formData: FormData = new FormData();
      //     formData.append('stepCustomId', this.id);
      //     formData.append('stepResponse', result.data.editorData);
      //     formData.append('comment', result.data.comment);
      //     formData.append('completionYear', result.data.completionYear);
      //     formData.append('attach', result.data.attach);
      //     this._sendResponse(formData);
      //   }
      // });
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
    this.onClickComment();
    // this.accordion.closeAll();
  }

  clearFilter() {
    // localStorage.removeItem('sabFilterType');
    // localStorage.removeItem('sabFilterSequence');
    // localStorage.removeItem('sabFilterDepartment');
    // localStorage.removeItem('sabFilterStatus');
    // localStorage.removeItem('sabSentItemsFilterType');
    // localStorage.removeItem('sabSentItemsFilterSequence');
    // localStorage.removeItem('sabSentItemsFilterDepartment');
    // localStorage.removeItem('sabSentItemsFilterStatus');
    // localStorage.removeItem('sabSentItemsFilterDirectorate');
    // localStorage.removeItem('sabSentItemsFilterBehalf');
    // localStorage.removeItem('sabSentItemsFilterMultipleDept');
    // localStorage.removeItem('sabResponseProgressFilterType');
    // localStorage.removeItem('sabResponseProgressFilterSequence');
    // localStorage.removeItem('sabResponseProgressFilterDepartment');
    // localStorage.removeItem('sabResponseProgressFilterStatus');
    // localStorage.removeItem('sabResponseProgressFilterDirectorate');
    // localStorage.removeItem('sabResponseProgressFilterBehalf');
    // localStorage.removeItem('sabResponseProgressFilterMultipleDept');
  }

  onEmailDocument(): void {
    let url = 'UserController/getSabMembers';
    // this._loading.setLoading(true, url);
    // this.coreService.get(url).subscribe(response => {
    //   this._loading.setLoading(false, url);
    const dialogRef = this.dialog.open(EmailDocumentComponent, {
      width: '800px',
      // data: { id: this.id, response: response },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _onBehalf = this.loginId;
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
  openWorkingDepartmentOfObservation() {
    //    this.workItem.assignedDepartmentNames = "Corporate Planning, Finance"
    let departmentsList = this.workItem.assignedDepartmentNames.split(' ; ')
    const dialogRef = this.dialog.open(WorkingDepartmentListComponent, {
      width: '500px',
      data: departmentsList
    });
  }

  viewAttachment(responseId: any) {

    let url = 'workItemController/getResponse?stepCustomId=' + this.id;
    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.loginId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.userJobTitle + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
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
      this.router.navigate(['/inbox']);
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }
 onReviewed(event:any): void {
  this.workItem.reviewed = event.checked ? 'yes' :'no';
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
    let url = `InProgController/reviewObservation?stepCustomId=${this.id}&isReviewed=${isChecked ? 'yes' :'no'}` 
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

  prevObservation(workItem:any){
    this.router.navigate(['inbox/work-item-details', this.selectedList[this.selectedIndex-1].stepCustomId],{queryParams : {selectedIndex: this.selectedIndex -1}})
  }
  
  nextObservation(workItem:any){
    this.router.navigate(['inbox/work-item-details', this.selectedList[this.selectedIndex+1].stepCustomId],{queryParams : {selectedIndex: this.selectedIndex +1}})
  }
  
  onShowOverview(data: any) {
    let url = 'InProgController/getOverViewDetailsInfo?stepCustomId=' + this.id +'&stepUnqName='+this.workItem.stepUniqueName+ '&userId=' + this.userId  + '&r=' + (Math.floor(Math.random() * 100) + 100);
   // let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
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
  openGPASenBackHistoryModel() {
    let _stepUniqueName=  encodeURIComponent(this.stepUniqueName);
    let url = 'InProgController/getRejectedReasons?deptCycleId=' + this.deptCycleId + '&stepUniqueName=' + _stepUniqueName + '&obsId=' + this.obsId + '&reportCycle=' + this.reportCycle;
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
     
     let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode+'&reportCycle='+this.workItem.reportCycle+'&reportYear='+this.workItem.reportYear+'&obsId='+this.workItem.obsId+'&stepUnqName='+stepUnqName+'&pageName=Work';
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
