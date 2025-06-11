import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { Manager } from 'src/app/models/manager';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-department-assignment',
  templateUrl: './department-assignment.component.html',
  styleUrls: ['./department-assignment.component.css']
})
export class DepartmentAssignmentComponent implements OnInit {
  displayedColumns: string[] = ['select', 'departmentName', 'loginId', 'userName', 'cmntButton'];
  displayedColumnsMob: string[] = ['select', 'departmentName'];
  isGeneralCmntEnabled: boolean = true;
  selectedManagers: Manager[] = [];
  isGroupCommentsEnabled: false;
  groupComment: String = '';
  directoratesList: Directorate[];
  noOfactiveDepts: number;
  isRtl: any;

  constructor(
    public dialogRef: MatDialogRef<DepartmentAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
    this.directoratesList = response.directoratesList;
    this.noOfactiveDepts = response.noOfActiveDepts;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
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
    if (manager.checked) {
      this.selectedManagers.push(manager);
    } else {
      this.selectedManagers.forEach((item, index) => {
        if (item.loginId === manager.loginId) this.selectedManagers.splice(index, 1);
      });
    }
  }

  onAddManagerComment(manager: Manager) {
    manager.comment = manager.comment.trim()
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
