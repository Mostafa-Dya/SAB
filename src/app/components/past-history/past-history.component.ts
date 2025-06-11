import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { SendResponseComponent } from '../send-response/send-response.component';
export interface HistoryData {
  historyName: string,
  historyList: []
}

@Component({
  selector: 'app-past-history',
  templateUrl: './past-history.component.html',
  styleUrls: ['./past-history.component.css']
})
export class PastHistoryComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'historyDate', 'stepName', 'responseTaken', 'from', 'to'];
  isRtl: any;
  historyData: HistoryData[] = [];

  constructor(
    public dialogRef: MatDialogRef<SendResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.historyData = this.responseData;
  }
}
