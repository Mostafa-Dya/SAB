import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate.model';
import { Manager } from 'src/app/models/manager.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-declined-by-manager',
  templateUrl: './declined-by-manager.component.html',
  styleUrls: ['./declined-by-manager.component.css']
})
export class DeclinedByManagerComponent implements OnInit {
  displayedColumns: string[] = ['select', 'departmentName'];
  displayedColumnsMob: string[] = ['select', 'departmentName'];
  isGeneralCmntEnabled: boolean = true;
  selectedManagers: Manager[] = [];
  isGroupCommentsEnabled: false;
  groupComment: String = '';
  directoratesList: Directorate[];
  noOfactiveDepts: number;
  currentDeptCode:any;
  departmentName:any;
  isRtl: any;

  constructor(
    public dialogRef: MatDialogRef<DeclinedByManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private sharedVariableService: SharedVariableService
  ) { 
    dialogRef.disableClose = true;
    this.directoratesList = response.directoratesList;
    this.noOfactiveDepts = response.noOfActiveDepts;
    this.departmentName = response.deprtment;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');

    for(let i = 0;i <this.directoratesList.length ;i++){
      for(let j =0;j < this.directoratesList[i].managersList.length;j++){
        console.log(this.directoratesList[i].managersList[j].departmentName.trim().toLowerCase())
        if(this.directoratesList[i].managersList[j].departmentName.trim().toLowerCase() == this.departmentName.trim().toLowerCase()){
          this.directoratesList[i].managersList.splice(j,1)
        }
      }
    }
   
  }

  removeTableComments() {
    this.isGeneralCmntEnabled = true;
    this.displayedColumns = ['select', 'departmentName'];
  }

  addTableComments() {
    this.isGeneralCmntEnabled = false;
    this.displayedColumns = ['select', 'departmentName'];
  }

  onSendToDepartments(): void {
    let manager = ''
    for(let i = 0;i<this.selectedManagers.length ;i++){
        if(this.selectedManagers.length - 1  == i){
          manager =  manager + this.selectedManagers[i].departmentName 
        }else{
          manager =  manager + this.selectedManagers[i].departmentName + ', '
        }
    }
    var _result = {
      groupComment: this.groupComment.trim(),
      selectedManagers: manager
    };
    console.log(_result)
    this.dialogRef.close({ event: 'Send', data: _result });
  }

  onManagerSelection(manager: Manager) {
    console.log(manager)
    if (manager.checked) {
      this.selectedManagers.push(manager);
    } else {
      this.selectedManagers.forEach((item, index) => {
        if (item.departmentCode === manager.departmentCode) this.selectedManagers.splice(index, 1);
      });
    }
  }



}
