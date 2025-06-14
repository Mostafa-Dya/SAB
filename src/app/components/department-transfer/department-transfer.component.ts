import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { Manager } from 'src/app/models/manager';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-department-transfer',
  templateUrl: './department-transfer.component.html',
  styleUrls: ['./department-transfer.component.scss']
})
export class DepartmentTransferComponent implements OnInit {
  displayedColumns: string[] = ['select', 'departmentName', 'loginId', 'userName', 'cmntButton'];
  displayedColumnsMob: string[] = ['select', 'departmentName'];
  isGeneralCmntEnabled: boolean = true;
  selectedManagers: Manager[] = [];
  isGroupCommentsEnabled: false;
  groupComment: String = '';
  directoratesList: Directorate[];
  noOfactiveDepts: number;
  isRtl: any;
  isSendDisabled: boolean = true;
  dialogName: String = '';
  userInformation: any;
  isAdmin: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DepartmentTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
    this.directoratesList = response.directoratesList;
    this.noOfactiveDepts = response.noOfActiveDepts;
    this.dialogName = response.dialogName;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
  }

  removeTableComments() {
    this.isGeneralCmntEnabled = true;
    this.displayedColumns = ['select', 'departmentName', 'loginId', 'userName', 'cmntButton'];
  }

  addTableComments() {
    this.isGeneralCmntEnabled = false;
    this.displayedColumns = ['select', 'departmentName', 'loginId', 'userName', 'cmntText'];
  }

  onSendToDepartments(): void {
    var _result = {
      groupComment: this.groupComment.trim(),
      selectedManagers: this.selectedManagers
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }

  onManagerSelection(manager: Manager) {
    setTimeout(() => {
      if (manager.checked) {
        this.selectedManagers.push(manager);
        // if (this.dialogName == 'Share' && (this.selectedManagers.length == 0 || this.selectedManagers.length + this.noOfactiveDepts) > 3) {
        if (this.dialogName == 'Share') {
          // if (this.selectedManagers.length > 0 && (this.selectedManagers.length + this.noOfactiveDepts) <= 3) {
          if (this.isAdmin) {
            if (this.selectedManagers.length > 0 && (this.selectedManagers.length + this.noOfactiveDepts) <= 3) {
              this.isSendDisabled = false;
            } else {
              this.isSendDisabled = true;
            }
          } else {
            if (this.selectedManagers.length > 0 && this.selectedManagers.length == 1) {
              this.isSendDisabled = false;
            } else {
              this.isSendDisabled = true;
            }
          }
          // } else if (this.dialogName == 'Transfer' && (this.selectedManagers.length == 0 || this.selectedManagers.length + (this.noOfactiveDepts - 1)) > 3) {
          //   this.isSendDisabled = true;
        } else if (this.dialogName == 'Transfer') {
          if (this.selectedManagers.length > 0 && (this.selectedManagers.length + (this.noOfactiveDepts - 1)) <= 3) {
            this.isSendDisabled = false;
          } else {
            this.isSendDisabled = true;
          }
        }
      } else {
        this.selectedManagers.forEach((item, index) => {
          if (item.loginId === manager.loginId) this.selectedManagers.splice(index, 1);
        });
        // if (this.dialogName == 'Share' && (this.selectedManagers.length == 0 || this.selectedManagers.length + this.noOfactiveDepts) > 3) {
        if (this.dialogName == 'Share') {
          // if (this.selectedManagers.length > 0 && (this.selectedManagers.length + this.noOfactiveDepts) <= 3) {
          if (this.isAdmin) {
            if (this.selectedManagers.length > 0 && (this.selectedManagers.length + this.noOfactiveDepts) <= 3) {
              this.isSendDisabled = false;
            } else {
              this.isSendDisabled = true;
            }
          } else {
            if (this.selectedManagers.length > 0 && this.selectedManagers.length == 1) {
              this.isSendDisabled = false;
            } else {
              this.isSendDisabled = true;
            }
          }
          // } else if (this.dialogName == 'Transfer' && (this.selectedManagers.length == 0 || this.selectedManagers.length + (this.noOfactiveDepts - 1)) > 3) {
          //   this.isSendDisabled = true;
        } else if (this.dialogName == 'Transfer') {
          if (this.selectedManagers.length > 0 && (this.selectedManagers.length + (this.noOfactiveDepts - 1)) <= 3) {
            this.isSendDisabled = false;
          } else {
            this.isSendDisabled = true;
          }
        }
      }
    });
  }

  onAddManagerComment(manager: Manager) {
    manager.comment = manager.comment.trim();
    if (manager.checked) {
      this.selectedManagers.forEach((item, index) => {
        if (item.loginId === manager.loginId) this.selectedManagers.splice(index, 1);
      });
      this.selectedManagers.push(manager);
    } else {
      this.selectedManagers.forEach((item, index) => {
        if (item.loginId === manager.loginId) this.selectedManagers.splice(index, 1);
      });
    }
  }
}
