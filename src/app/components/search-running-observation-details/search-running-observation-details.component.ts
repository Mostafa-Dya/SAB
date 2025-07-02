// import { analyzeAndValidateNgModules } from '@angular/compiler';
// import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ApproveComponent } from '../approve/approve.component';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';
import { DepartmentTransferComponent } from '../department-transfer/department-transfer.component';
import { SendResponseBehalfComponent } from '../send-response-behalf/send-response-behalf.component';
import { SendResponseComponent } from '../send-response/send-response.component';

@Component({
  selector: 'app-search-running-observation-details',
  templateUrl: './search-running-observation-details.component.html',
  styleUrls: ['./search-running-observation-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchRunningObservationDetailsComponent implements OnInit {
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

  userInformation: any;
    selectedDelegateUserInfo:any;
    isAdmin:any;
    userJobTitle:any
    userId:any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.loginId = localStorage.getItem('loginId') || '';
    this.route.params.subscribe(params => {
      this.id = params['stepCustomId'];
    });

    
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.loginId = localStorage.getItem('loginId') || '';

    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.userId = this.userInformation.sabMember.loginId;
    this.getWorkItemInfo();
  }

  getWorkItemInfo() {
    this.isLoading = true;
    let url = 'InProgController/getRunningObsDetails?stepCustomId=' + this.id;    
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.deptCycleId = response.deptCycleId;
      this.reportCycle = response.reportCycle;
      this.workItem = response;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
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
          var stepIds: Array<string> = [];
          stepIds.push(this.id);
          var _result = {
            stepCustomIds: stepIds,
            groupComment: result.data.groupComment,
            selectedFormatters: result.data.selectedFormatters,
            selectedHeads: result.data.selectedHeads
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
    let url = 'workItemController/sendResponse?stepCustomId=' + this.id + '&stepResponse=' + result;

    if (this.selectedDelegateUserInfo) {
      url = url + '&loginId=' + this.userId + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&userJobTitle=' + this.selectedDelegateUserInfo.userJobTitle;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId + '&userJobTitle=' + this.userJobTitle;
      } else {
        url = url + '&loginId=' + this.loginId + '&isDelegatedUser=false&onBehalfOf=' + this.userId + '&userJobTitle=' + this.userJobTitle;
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
}
