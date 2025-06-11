import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-other-responses',
  templateUrl: './other-responses.component.html',
  styleUrls: ['./other-responses.component.css']
})
export class OtherResponsesComponent implements OnInit {
  isRtl: any;
  dipartmentData: any;

  constructor(
    public dialogRef: MatDialogRef<OtherResponsesComponent>,
    @Inject(MAT_DIALOG_DATA) public executiveData: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.dipartmentData = this.executiveData;
  }

}
