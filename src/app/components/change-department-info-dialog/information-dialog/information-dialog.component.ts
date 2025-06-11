import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from '../../../services/shared-variable.service';


@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.css']
})
export class InformationDialog {
  isRtl: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
