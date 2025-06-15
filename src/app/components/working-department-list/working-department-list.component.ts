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
  selector: 'app-working-department-list',
  templateUrl: './working-department-list.component.html',
  styleUrls: ['./working-department-list.component.css']
})
export class WorkingDepartmentListComponent implements OnInit {
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
    for(let i = 0;i< this.responseData.length ; i++){
      // console.log(this.responseData[i] == '')
      if(this.responseData[i] != ''){
        this.historyData.push(this.responseData[i])   
      }
    }
    

    //  this.historyData = this.responseData;
   
  }


}
