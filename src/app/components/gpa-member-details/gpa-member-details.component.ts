import { Component,  Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gpa-member-details',
  templateUrl: './gpa-member-details.component.html',
  styleUrls: ['./gpa-member-details.component.css']
})
export class GPAMemberDetailsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['userName','userMail','extensionNo' ];
  constructor(
    public dialogRef: MatDialogRef<GPAMemberDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    console.log(this.data)
    this.dataSource = new MatTableDataSource(this.data.dialogData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
  }


  save(): void {
     this.dialogRef.close({ event: 'Send', data: this.data });
  }
}
