import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';



@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  isRtl: any;
  comment: string = '';
  isReasonFirst: any = true;
 
  showError: boolean;
  userInformation: any;

  constructor(
    public dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
   
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isReasonFirst = false;

   // this.userInformation.admin = !this.userInformation.admin;
  }

  onSend(): void {
    var _result;
    if (this.userInformation.admin) {
   
      _result = {
        comment: this.comment.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    } else {
      // if (this.comment == undefined) {
      //   this.comment = '';
      // }
      _result = {
        comment: this.comment.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    }
  }

}
