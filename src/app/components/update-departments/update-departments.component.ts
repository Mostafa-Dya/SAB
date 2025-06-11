import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { Manager } from 'src/app/models/manager';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';

@Component({
  selector: 'app-update-departments',
  templateUrl: './update-departments.component.html',
  styleUrls: ['./update-departments.component.css']
})
export class UpdateDepartmentsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'departmentName', 'loginId', 'userName'];
  displayedColumnsMob: string[] = ['select', 'departmentName'];
  selectedManagers: Manager[] = [];
  directoratesList: Directorate[];
  isRtl: any;

  constructor(
    public dialogRef: MatDialogRef<DepartmentAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
    response.directoratesList.map((directorate: any) => {
      directorate.managersList.map((manager: any) => {
        response.departments.map((department: any) => {
          if (department.departmentName != 'N/A') {
            if (manager.departmentCode == department.departmentCode) {
              // manager.checked = true;
              // this.selectedManagers.push(manager);
            }
          }
        })
      })
    })
  //  setTimeout(() => {
    this.directoratesList = response.directoratesList;
  //  },);
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
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

  onChangeDepartments(): void {
    var _result = {
      selectedManagers: this.selectedManagers
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }
}
