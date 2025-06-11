import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface HistoryData {
  "reminderSendDate":string,
  "reminderSendTo":string,
  "reminderSendFrom":string,
}

@Component({
  selector: 'app-reminder-history',
  templateUrl: './reminder-history.component.html',
  styleUrls: ['./reminder-history.component.scss']
})
export class ReminderHistoryComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'sentDate', 'deptName','addedByUserName','pendingUserName'];
  isRtl: any;
  historyData: HistoryData[] = [];
  dataSource: MatTableDataSource<HistoryData>;
  pageIndex: string | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public responseData: any,
    private sharedVariableService: SharedVariableService
  ) {
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
     this.historyData = this.responseData;
     this.dataSource = new MatTableDataSource(this.historyData);
     setTimeout(()=>{
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     },200)
  }

  onPaginateChange(event: any) {
    this.pageIndex = event.pageIndex;
  }
}
