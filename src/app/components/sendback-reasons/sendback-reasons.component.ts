import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface SendBackReason {
  "sentFrom":string,
  "sentTo":string,
  "rejectedDate":string,
  "rejectReason":string
}

@Component({
  selector: 'app-sendback-reasons',
  templateUrl: './sendback-reasons.component.html',
  styleUrls: ['./sendback-reasons.component.scss']
})
export class SendBackReasonsComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'sentFrom', 'sentTo','rejectedDate','rejectReason'];
  isRtl: any;
  historyData: SendBackReason[] = [];
  dataSource: MatTableDataSource<SendBackReason>;
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
