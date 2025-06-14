import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/models/department';
import { StaffMemebr } from 'src/app/models/staff-member';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-assign-to-staff',
  templateUrl: './assign-to-staff.component.html',
  styleUrls: ['./assign-to-staff.component.css']
})
export class AssignToStaffComponent implements OnInit {
  displayedColumns: string[] = ['select', 'loginId', 'userName', 'ecmJobTitle', 'cmntButton'];
  displayedColumnsMob: string[] = ['select', 'loginId'];
  isGeneralCmntEnabled: boolean = true;
  isAssignButtonEnabled: boolean = true;
  selectedStaff: StaffMemebr[] = [];
  isGroupCommentsEnabled: false;
  groupComment: string = '';
  departmentData:Department;
  isRtl: any;
  dialougeType: string = '';
  activeParticipants: number;
  liveItems: number;
  public tlDS = new MatTableDataSource<any>();
  public engDS = new MatTableDataSource<any>();
  btnValue: string;
  isStaffTabHide = false;
  constructor(
    public dialogRef: MatDialogRef<AssignToStaffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    
    this.departmentData = data.departmentData;
    this.dialougeType = data.dialougeType;
    this.activeParticipants = data.activeParticipants;
    this.liveItems =  data.departmentData.liveItems;
    dialogRef.disableClose = true;
    if(this.dialougeType == 'ASSIGN_STAFF') {
      this.btnValue = 'ASSIGN';
    } else {
      this.btnValue = 'RE_ASSIGN';
    }
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.tlDS.data = this.departmentData.tls;
    this.engDS.data = this.departmentData.engs;
  }

  onStaffSelection(staffMember: StaffMemebr) {
    if (staffMember.checked) {
      this.selectedStaff.push(staffMember);
    } else {
      this.selectedStaff.forEach((item, index) => {
        if (item.loginId === staffMember.loginId) this.selectedStaff.splice(index, 1);
      });
    }
    if(this.dialougeType =='RE_ASSIGN_STAFF' && this.selectedStaff.length != 0){
      if(this.liveItems==2){
        if(this.selectedStaff.length == 1){
          this.isAssignButtonEnabled  = false;
          }else if(this.selectedStaff.length ==2){
            this.isAssignButtonEnabled  = true;
          }else{
           this.isAssignButtonEnabled  = true;
          }
      }else{
     if(this.activeParticipants == 1 && this.selectedStaff.length <= 2){
     this.isAssignButtonEnabled  = false;
     }else if(this.activeParticipants == 1 && this.selectedStaff.length ==1){
      this.isAssignButtonEnabled  = false;
     }else if(this.activeParticipants == 2 && this.selectedStaff.length ==1){
      this.isAssignButtonEnabled  = false;
     }else{
      this.isAssignButtonEnabled  = true;
     }
    }
    }else if(this.dialougeType =='ASSIGN_STAFF' && this.selectedStaff.length != 0){
      if(this.liveItems==2){
        if(this.selectedStaff.length == 1){
          this.isAssignButtonEnabled  = false;
          }else if(this.selectedStaff.length ==2){
            this.isAssignButtonEnabled  = true;
          }else{
           this.isAssignButtonEnabled  = true;
          }
      }else{
      if(this.activeParticipants == 1 && this.selectedStaff.length == 1){
      this.isAssignButtonEnabled  = false;
      }else if(this.activeParticipants == 0 && this.selectedStaff.length <=2){
       this.isAssignButtonEnabled  = false;
      }else{
       this.isAssignButtonEnabled  = true;
      }
    }
     }else{
      this.isAssignButtonEnabled  = true;
     }
     if(this.selectedStaff.length==2){
      let  member1 = this.selectedStaff[0];
      let member2 = this.selectedStaff[1];  
      if(member1.divisionCode == member2.divisionCode){
        this.isAssignButtonEnabled  = true;
      }   
      }
  }

  addTableComments() {
    this.isGeneralCmntEnabled = false;
    this.displayedColumns = ['select', 'loginId', 'userName', 'ecmJobTitle', 'cmntText'];
  }

  removeTableComments() {
    this.isGeneralCmntEnabled = true;
    this.displayedColumns = ['select', 'loginId', 'userName', 'ecmJobTitle', 'cmntButton'];
  }

  onAddStaffComment(staffMember: StaffMemebr) {
    staffMember.comment =  staffMember.comment.trim()
    if (staffMember.checked) {
      this.selectedStaff.forEach((item, index) => {
        if (item.loginId === staffMember.loginId) this.selectedStaff.splice(index, 1);
      });
      this.selectedStaff.push(staffMember);
    } else {
      this.selectedStaff.forEach((item, index) => {
        if (item.loginId === staffMember.loginId) this.selectedStaff.splice(index, 1);
      });
    }
  }

  onSendToDepartments(): void {
    var _result = {
      groupComment: this.groupComment.trim(),
      selectedStaff: this.selectedStaff
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }
}
