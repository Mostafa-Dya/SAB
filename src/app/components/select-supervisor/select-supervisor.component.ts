import { Component,  Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersData, department, directorate } from '../users/users.component';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-select-supervisor',
  templateUrl: './select-supervisor.component.html',
  styleUrls: ['./select-supervisor.component.css']
})
export class SelectSupervisorComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<UsersData>;
  //dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['action','userName', 'loginId','userTitle','userjobTitle', 'departmentName'];
  displayedColumnsMob: string[] = ['userName'];
  selectedLoginId: string = '';
  selectedName: string = '';
  selectedDepartment: any = "0";
  selectedDirectorate:any = "0" ;
  currentDeptCode: any = "0";
  currentDirectorateCode:any = "0" ;
  selected:any
  isLoading: boolean = true;
  departmentValue: department[] = [];
  directorateValue: directorate[] = [
    { id: "0", name: "All" },
  ];
  @ViewChild(MatSort) sort: MatSort;
  // displayedColumns: string[] = ["name",'email','phone' ];
  // displayedColumns: string[] = ['action','userName', 'loginId','userTitle','userjobTitle', 'departmentName','directorateName'];
  constructor(
    private coreService: CoreService,
    private configService: ConfigService,
    private _loading: LoadingService,
    public dialogRef: MatDialogRef<SelectSupervisorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.currentDeptCode = this.data.currentDeptCode;
    this.currentDirectorateCode =this.data.currentDirectorateCode
    this.directorateValue = this.data.directorateValue
    this.departmentValue = this.data.departmentValue
    // console.log(this.data)
    // this.dataSource = new MatTableDataSource(this.data);
    // setTimeout(() => {
    //   this.dataSource.sort = this.sort;
    // });
    this.getdirectorate();
  }

  getdirectorate(){
    this.directorateValue = [
      {id: "0", name:"All"}
    ]
    let url = 'UserController/getAllDirectorates';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response: any).forEach((key) => {
        this.directorateValue.push({ id: key, name: response[key] })
      })
      this.directorateValue.sort((a:any, b:any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
  },
  error => {
    this._loading.setLoading(false, url);
    console.log('error :' , error);
  });
}

  getdepartment(){
    let url = 'UserController/getKNPCAllDepartments?directorateId=' +  this.selectedDirectorate;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.departmentValue = [];
      this.departmentValue.push({ id: "0", name: "All" })
      Object.keys(response: any).forEach((key) => {
        this.departmentValue.push({ id: key, name: response[key] })
      })
      this.directorateValue.sort((a:any, b:any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    },
    error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  search() {
    this.isLoading = true;
    let url = `UserController/getSabUsersListDetails?`;
    url = this.selectedLoginId != '' ? `${url}userId=${this.selectedLoginId}&`: url;
    url = this.selectedName != '' ? `${url}userName=${this.selectedName}&`: url;
    url = url+'&departmentCode='+this.currentDeptCode+'&directorateCode='+this.currentDirectorateCode;
   // url = this.selectedDepartment != ""  ? `${url}departmentCode=${this.selectedDepartment}&`: url;
   // url = this.selectedDirectorate != ""  ? `${url}directorateCode=${this.selectedDirectorate}`: url;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
    this.isLoading = false;    
    this._loading.setLoading(false, url);
    var _newResponse= [];
    for(var i=0;i<response.length;i++){
      var user =response[i];
      var title = user.userJobTitle.trim();
      if (title === "ENG" || title === "SENG" || title === "SEC") {
        //response.splice(i); // Tim is now removed from "users"
      }else{
        _newResponse.push(user);
      }
    }
    _newResponse.sort((a:any, b:any) => {
      let fa = a.userName.toLowerCase();
      let fb = b.userName.toLowerCase();
      if ( fa < fb ){
       return -1;
     }
     if ( fa > fb ){
       return 1;
     }
     return 0;
     });
    this.dataSource = new MatTableDataSource(_newResponse);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    })
    },
     (error:any) => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }


  save(): void {
     this.dialogRef.close({ event: 'Send', data: this.selected });
  }
  selectRow(element:any){
    // console.log(element)
    this.selected = element
  }
}

