import { Component,  Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface DateTable {
  "userName": string,
  "userMail": string,
  "extensionNo": string,
  "departmentName": string
}

@Component({
  selector: 'app-contact-person-details',
  templateUrl: './contact-person-details.component.html',
  styleUrls: ['./contact-person-details.component.css']
})
export class ContactPersonDetailsComponent implements OnInit {
  isRtl: any;
  response:any;
  dataSource: MatTableDataSource<DateTable>;
  displayedColumns: string[] = ['userName', 'userMail','userLogin', 'department'];
 
  @ViewChild(MatSort) sort: MatSort;
  //displayedColumns: string[] = ["name",'email','phone' ];
  constructor(
    public dialogRef: MatDialogRef<ContactPersonDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    //this.response = this.data.dialogData;
     this.dataSource = new MatTableDataSource(this.data.dialogData);
    console.log(this.data)
   
  }


  save(): void {
     this.dialogRef.close({ event: 'Send', data: this.data });
  }
}
