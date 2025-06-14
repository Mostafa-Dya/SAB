import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-change-department-info-dialog',
  templateUrl: './change-department-info-dialog.component.html',
  styleUrls: ['./change-department-info-dialog.component.css']
})
export class ChangeDepartmentInfoDialogComponent implements OnInit {
  dialogHeader: string;
  dialogMessage: string;
  isRtl: any;
  comment: String = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeDepartmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onClickYes() {
    this.dialogRef.close();
  }
}
