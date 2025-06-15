import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectSupervisorComponent } from '../select-supervisor/select-supervisor.component';

export interface department {
  id: string;
  name: string;
}

export interface directorate {
  id: string;
  name: string;
}

export interface UsersData {
  userName: string;
  userTitle: string;
  loginId:string;
  useJobTitle: string;
  departmentName: string;
  directorateName: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  isRtl: any;
  dataSource: MatTableDataSource<UsersData>;
  displayedColumns: string[] = ['userName', 'loginId','userTitle','userjobTitle', 'departmentName','directorateName','action'];
  displayedColumnsMob: string[] = ['userName','action'];
  selectedLoginId: string = '';
  selectedName: string = '';
  selectedDepartment: any = "0";
  selectedDirectorate:any = "0" ;
  userInformation: any;
  isLoading: boolean = true;
  mainUrl: string;
  innerWidth = 0;
  userJobTitle:any = ['MGR','TL','SENG','ENG','SEC'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  departmentValue: department[] = [];


  directorateValue: directorate[] = [
    { id: "0", name: "All" },
  ];
  router: any;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    public dialog: MatDialog,
    private notification: NzNotificationService,
  ) { 
  }

  ngOnInit(): void {
    
    let userData: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(userData);
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.getdirectorate();
    this.innerWidth =  window.innerWidth;
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }

  getdirectorate(){
    this.directorateValue = [
      {id: "0", name:"All"}
    ]
    let url = 'UserController/getAllDirectorates';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
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
      Object.keys(response).forEach((key) => {
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
    let url = `UserController/getNonUserInfo?`;
    url = this.selectedLoginId != '' ? `${url}userId=${this.selectedLoginId}&`: url;
    url = this.selectedName != '' ? `${url}userName=${this.selectedName}&`: url;
    url = this.selectedDepartment != ""  ? `${url}departmentCode=${this.selectedDepartment}&`: url;
    url = this.selectedDirectorate != ""  ? `${url}directorateCode=${this.selectedDirectorate}`: url;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
    this.isLoading = false;    
    this._loading.setLoading(false, url);
    response.sort((a:any, b:any) => {
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
    // let userjobTitle:any = [];
    // for(let i = 0 ;i< response.length;i++){
    //   if(i == 0){
    //     if(response[i].userjobTitle){
    //       userjobTitle.push(response[i].userjobTitle)
    //     }
    //   }else{
    //     if(userjobTitle.includes(response[i].userjobTitle)){
    //     }else{
    //       if(response[i].userjobTitle){
    //         userjobTitle.push(response[i].userjobTitle)
    //       }
    //     }
    //   }
    //   if(i == response.length -1){
    //     console.log( userjobTitle)
    //     this.userjobTitle = userjobTitle;
    //   }
    // }
    this.dataSource = new MatTableDataSource(response);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
    },
     error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  _add(data: any) {
 let addedBy =   this.userInformation.sabMember.loginId;
    let url = 'UserController/addSabUser?addedBy='+addedBy+'&loginId='+data.loginId+'&userjobTitle='+data.userJobTitle;
    if(data.userJobTitle=='SEC'){
      url = url+'&supervisorLogin='+data.supervisor;
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(
      (Response) => {       
        this._loading.setLoading(false, url);
        
        this.notification.create(
          "success",
          "Success",
          "User added successfully"
        );
        this.search();
      },
      (error) => {
        // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
        console.log("err  :", error);
      }
    );
  }

  add(userData: any) {
    if(userData.userJobTitle == 'SEC' ){

      const dialogRef = this.dialog.open(SelectSupervisorComponent, {
          width: '950px',
        //  height: '300px',
          data: {
            departmentValue : this.departmentValue,
            directorateValue:this.directorateValue,
            currentDeptCode:userData.departmentCode,
            currentDirectorateCode:userData.directorateCode
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Send') {
            let _response = result.data;
            userData.supervisor = _response.loginId;
            console.log('_response',_response);
            this._add(userData)
          }
        });
      /** 
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          dialogHeader: 'Update Job Title',
          dialogMessage:  'ARE_YOU_SURE_UPDATE_SUPERVISOR'
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if (result) {
          // this._onEditResponse(result);
          const dialogRef = this.dialog.open(SelectSupervisorComponent, {
          //  width: '800px',
          //  height: '300px',
            data: {
              departmentValue : this.departmentValue,
              directorateValue:this.directorateValue
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Send') {
              let _response = result.data;
              userData.supervisor = _response.loginId;
              console.log('_response',_response);
              this._add(userData)
            }
          });
        }
      }); **/


    }else{
      this._add(userData)
    }
  }

}
