import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SabMember } from 'src/app/models/sab-member';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-assign-to-executive',
  templateUrl: './assign-to-executive.component.html',
  styleUrls: ['./assign-to-executive.component.css']
})
export class AssignToExecutiveComponent implements OnInit {
  displayedColumns: string[] = ['select', 'loginId', 'userName', 'departmentName', 'cmntButton'];
  displayedColumnsMob: string[] = ['select', 'loginId'];
  isGeneralCmntEnabled: boolean = true;
  selectedExecutive: SabMember[] = [];
  groupComment: String = '';
  liveItems: number;
  public managersDS = new MatTableDataSource<SabMember>();
  public dceosDS = new MatTableDataSource<SabMember>();
  isRtl: any;
  dialougeType: String = '';
  activeParticipants: number;
  isAssignButtonEnabled: boolean = true;
  executiveData:any;
  constructor(
    public dialogRef: MatDialogRef<AssignToExecutiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    this.executiveData = data;
    this.dialougeType = this.executiveData.dialougeType;
    this.activeParticipants = this.executiveData.activeParticipants;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.managersDS.data = this.executiveData.execUsers.managers;
    this.dceosDS.data = this.executiveData.execUsers.dceos;
    this.liveItems = this.executiveData.execUsers.liveItems;
  }

  filterManagers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.managersDS.filter = filterValue.trim().toLowerCase();
  }

  filterDCEO(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dceosDS.filter = filterValue.trim().toLowerCase();
  }

  removeTableComments() {
    this.isGeneralCmntEnabled = true;
    this.displayedColumns = ['select', 'loginId', 'userName', 'departmentName', 'cmntButton'];
  }

  addTableComments() {
    this.isGeneralCmntEnabled = false;
    this.displayedColumns = ['select', 'loginId', 'userName', 'departmentName', 'cmntText'];
  }

  onExecutiveSelection(sabMember: SabMember) {
    if (sabMember.checked) {
      this.selectedExecutive.push(sabMember);
    } else {
      this.selectedExecutive.forEach((item, index) => {
        if (item.loginId === sabMember.loginId) this.selectedExecutive.splice(index, 1);
      });
    }
    if(this.dialougeType =='ReAssign' && this.selectedExecutive.length != 0){
      if(this.liveItems==2){
        if(this.selectedExecutive.length == 2){
          this.isAssignButtonEnabled  = true;
          }else if(this.selectedExecutive.length ==1){
           this.isAssignButtonEnabled  = false;
          }else{
           this.isAssignButtonEnabled  = true;
          }
      }
      else{
      if(this.activeParticipants == 1 && this.selectedExecutive.length <= 2){
      this.isAssignButtonEnabled  = false;
      }else if(this.activeParticipants == 1 && this.selectedExecutive.length ==1){
       this.isAssignButtonEnabled  = false;
      }else if(this.activeParticipants == 2 && this.selectedExecutive.length ==1){
       this.isAssignButtonEnabled  = false;
      }else{
       this.isAssignButtonEnabled  = true;
      }
    }
     }else if(this.dialougeType =='Assign' && this.selectedExecutive.length != 0){
      if(this.liveItems==2){
        if(this.selectedExecutive.length == 1){
          this.isAssignButtonEnabled  = false;
          }else if(this.selectedExecutive.length ==2){
           this.isAssignButtonEnabled  = true;
          }else{
           this.isAssignButtonEnabled  = true;
          }
      }
      else{
       if(this.activeParticipants == 1 && this.selectedExecutive.length == 1){
       this.isAssignButtonEnabled  = false;
       }else if(this.activeParticipants == 0 && this.selectedExecutive.length <=2){
        this.isAssignButtonEnabled  = false;
       }else{
        this.isAssignButtonEnabled  = true;
       }
      }
    }
      else{
       this.isAssignButtonEnabled  = true;
      }
  }

  onAddExecutiveComment(sabMember: SabMember) {
    sabMember.comment = sabMember.comment.trim();
    if (sabMember.checked) {
      this.selectedExecutive.forEach((item, index) => {
        if (item.loginId === sabMember.loginId) this.selectedExecutive.splice(index, 1);
      });
      this.selectedExecutive.push(sabMember);
    } else {
      this.selectedExecutive.forEach((item, index) => {
        if (item.loginId === sabMember.loginId) this.selectedExecutive.splice(index, 1);
      });
    }
  }

  onSendToExecutives(): void {
    var _result = {
      groupComment: this.groupComment.trim(),
      selectedExecutives: this.selectedExecutive
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }
}
