import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../assign-to-staff/assign-to-staff.component';
import { DepartmentAssignmentComponent } from '../department-assignment/department-assignment.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(public dialog: MatDialog,private userService: UserService) {}

  ngOnInit(): void {
  }

  assignStaffDialog(): void {
    var _this =this;

    this.userService.getStaffMembers('ECMTest_Mgr_CP','','','').subscribe(
      function( response ) {
        const dialogRef = _this.dialog.open(AssignToStaffComponent, {
          width: window.innerWidth+'px',
        //width:'700px',
          height:'550px',
          data: response
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log("Info : The dialog was closed");
        //  this.animal = result;
        });
      

      },
    function( err ) {
      console.log('err  :',err);

    });
     
  }

  
  assignToExecutive(): void {
    var _this =this;

    this.userService.getExecutiveUsers().subscribe(
      function( response ) {
        const dialogRef = _this.dialog.open(AssignToExecutiveComponent, {
          width: window.innerWidth+'px',
        //width:'700px',
          height:'550px',
          data: response
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Info : The dialog was closed');
        //  this.animal = result;
        });
      

      },
    function( err ) {
      console.log('err  :',err);

    });
     
  }

  assignToCommittee(): void {
    var _this =this;

    this.userService.getCommitteeUsers().subscribe(
      function( response ) {
        const dialogRef = _this.dialog.open(AssignToCommitteeComponent, {
          width: window.innerWidth+'px',
        //width:'700px',
          height:'550px',
          data: response
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Info : The dialog was closed');
        //  this.animal = result;
        });
      

      },
    function( err ) {
      console.log('err  :',err);

    });
     
  }
  openDialog(): void {
     var _this =this;
    this.userService.getDepartments('33','333','33','333').subscribe(
      function( response ) {
        const dialogRef = _this.dialog.open(DepartmentAssignmentComponent, {
          width: window.innerWidth+'px',
        //width:'700px',
          height:'650px',
          data: response
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Info : The dialog was closed');
        //  this.animal = result;
        });
      

      },
    function( err ) {
      console.log('err  :',err);

    });
    
  }

}
