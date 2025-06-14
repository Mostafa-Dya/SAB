import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConformationData } from 'src/app/models/conformation-data.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  dialogHeader: string;
  dialogMessage: string;
  isRtl: any;
  comment: String = '';
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConformationData,
    private sharedVariableService: SharedVariableService,
    
  ) {
    this.dialogHeader = data.dialogHeader;
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onClickYes() {
    var _result = {
      comment: this.comment.trim()
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }

}
