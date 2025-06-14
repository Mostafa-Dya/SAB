import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-decline-send-back',
  templateUrl: './decline-send-back.component.html',
  styleUrls: ['./decline-send-back.component.css']
})
export class DeclineSendBackComponent implements OnInit {
  isRtl: any;
  comment: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeclineSendBackComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onSend(): void {
    if (this.comment == undefined) {
      this.comment = '';
    }
    let _result = {
      comment: this.comment.trim()
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }
}
