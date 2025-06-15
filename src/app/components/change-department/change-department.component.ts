import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ChangeDepartmentInfoDialogComponent } from '../change-department-info-dialog/change-department-info-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UpdateDepartmentsComponent } from '../update-departments/update-departments.component';

export interface ObservationData {
  position:number;
  obsTitle: string;
  // obsId: string;
  obsSequence: number;
  completed: boolean;
  directorate: string;
  departments: string;
  isActionDisabled: boolean;
  changedDep:any;
}

@Component({
  selector: 'app-change-department',
  templateUrl: './change-department.component.html',
  styleUrls: ['./change-department.component.css']
})
export class ChangeDepartmentComponent implements OnInit {
  isLoading: boolean = false;
  reportId: any;
  isRtl: any;
  dataSource: MatTableDataSource<ObservationData>;
  displayedColumns: string[] = ['obsSequence', 'obsTitle', 'departments', 'directorate', 'action','changeDepartment'];
  displayedColumnsMob: string[] = ['obsTitle'];
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reportYear: any;
  loginId: any;
  userName: any;
  userInformation: any;
  mainUrl: string;
  response: any[] = [];
  innerWidth = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    public dialog: MatDialog,
    private configService: ConfigService,
    private _loading: LoadingService,
    private notification: NzNotificationService
  ) {
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = params['reportId'];
    });
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.loginId = localStorage.getItem('loginId') || '';
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.reportYear = this.userInformation.reportYear;
    this.loginId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
    this.innerWidth =  window.innerWidth;
    this.getObservationData()
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }

   getUserInfo() {
    let url = 'UserController/getUserInfo?userId=' + this.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response: any) => {
      this._loading.setLoading(false, url);
      this.userInformation = response;
      this.reportYear = response.reportYear;
      this.loginId = response.sabMember.loginId;
      this.userName = response.sabMember.userName;
      localStorage.setItem('sabUserInformation', JSON.stringify(response));
    }, error => {
      console.log('error  :', error);
    })
  }

  getObservationData() {
    this.isLoading = true
    let url = 'AssigmentsController/getObservationDepartments?reportCycle=' + this.userInformation.reportCycle + '&reportYear=' + this.userInformation.reportYear + '&r=' + (Math.floor(Math.random() * 100) + 100);;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
      this._loading.setLoading(false, url);
      this.isLoading = false;
      this.response = response;
      let data = [];
      let index= 0;
      for (let i = 0; i < response.length; i++) {
        let isChangeDepartmentAvailable = true;
        let department = '';
        let directorateName = '';
        for (let dep = 0; dep < response[i].departments.length; dep++) {
          department = department + (response[i].departments[dep].departmentName ? response[i].departments[dep].departmentName : '');
          if(response[i].departments[dep].directorateName && !directorateName.includes(response[i].departments[dep].directorateName)){
            directorateName = directorateName + (response[i].departments[dep].directorateName ? response[i].departments[dep].directorateName : '');
          }
          if (dep != response[i].departments.length - 1) {
            department = department + ", ";
            directorateName = directorateName + ", ";
          }
          let depName = response[i].departments[dep].departmentName;
          // if ((depName == 'Special Nature' || depName == 'Committee' || depName == 'G&PA' || depName == "Chief Executive Officer's Office" || depName == 'CategoryGPA')) {
          if ( depName.departmentName == 'G&PA' || depName == 'CategoryGPA') {
            isChangeDepartmentAvailable = false;
          }
        }        
        if (isChangeDepartmentAvailable) {
          if (!response[i].completed) {
            isChangeDepartmentAvailable = false;
          }
        }
        data.push({
          "position":index,
          'obsSequence': response[i].obsSequence,
          'obsTitle': response[i].obsTitle,
          'departments': department,
          'directorate': directorateName,
          'completed': response[i].completed,
          'changedDep':response[i].changedDep,
          'isActionDisabled': !isChangeDepartmentAvailable
        })
        index = index + 1
      }
      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      }, 100)
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  changeDepartmentInfo(data:any){
    const dialogRef = this.dialog.open(ChangeDepartmentInfoDialogComponent, {
      data: data.changedDep
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("Info : Dialog Closed")
    });
  }

  updateDepartment(index: any) {
    this.isLoading = true;
    let data = this.response[index]
    let url = 'UserController/getAllDepartments?userId=' + this.loginId + '&obsId=' + data.obsId + '&reportCycle=' + this.userInformation.reportCycle;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      let _result = {
        "directoratesList": response,
        "departments": data.departments
      }
      const dialogRef = this.dialog.open(UpdateDepartmentsComponent, {
        data: _result
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == 'Send') {
          var assignToDeptData = {
            obsId: data.obsId,
            reportYear: this.userInformation.reportYear,
            managers: result.data.selectedManagers,
            reportCycle: this.userInformation.reportCycle
          }
          this.assignToDeptartment(assignToDeptData);
        } else {
          // this.getObservationData();
        }
      });
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('err  :', error);
    });
  }

  assignToDeptartment(result: any): void {
    let url = 'AssigmentsController/updateDepartmentBeforeLaunch';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.getObservationData();
    }, error => {
      this._loading.setLoading(false, url);
      this.getObservationData();
      console.log('err  :', error);
    });
  }

  launchReport() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'COMPLETE_LAUNCHING',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT',
        reportCycle: this.reportId
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        let formData: FormData = new FormData();
        formData.append('report',this.reportId);
        formData.append('typeValue', 'DirectLaunch');
        formData.append('reportYear',this.userInformation.reportYear);
        formData.append('extractType', '');
        let url = 'launchObservations/launchIntialReport';
        this._loading.setLoading(true, url);
        this.coreService.post(url, formData).subscribe((response: any) => {
          this.isLoading = false;
          this._loading.setLoading(false, url);         
          this.clearFilter();
          if (response.type != 'Failure') {
            this.getUserInfo();
            this.router.navigate(['/inbox']);
          } else {
            this.notification.create('error', 'Error', response.message);
          }
        }, error => {
          this.isLoading = false;
          this._loading.setLoading(false, url);
          console.log("error : ",  error);
        })
      }
    })
  }


  CheckDipartmentType(data: any) {
    // let data = this.response[index];
    let isDepartmentMatch = false;
    for (let i = 0; i < data.departments.length; i++) {
      // if ((data.departments[i].departmentName == 'Special Nature' || data.departments[i].departmentName == 'Committee' || data.departments[i].departmentName == 'G&PA' || data.departments[i].departmentName == "Chief Executive Officer's Office" || data.departments[i].departmentName == 'CategoryGPA')) {
        if ( data.departments[i].departmentName == 'G&PA' || data.departments[i].departmentName == 'CategoryGPA') {
        isDepartmentMatch = true;
        return false;
      }
    }
    if (!isDepartmentMatch && data.completed) {
      return false;
    } else {
      return true;
    }
  }

  clearFilter() {
    localStorage.removeItem('sabFilterType');
    localStorage.removeItem('sabFilterSequence');
    localStorage.removeItem('sabFilterDepartment');
    localStorage.removeItem('sabFilterStatus');
    localStorage.removeItem('sabSentItemsFilterType');
    localStorage.removeItem('sabSentItemsFilterSequence');
    localStorage.removeItem('sabSentItemsFilterDepartment');
    localStorage.removeItem('sabSentItemsFilterStatus');
    localStorage.removeItem('sabSentItemsFilterDirectorate');
    localStorage.removeItem('sabSentItemsFilterBehalf');
    localStorage.removeItem('sabSentItemsFilterMultipleDept');
    localStorage.removeItem('sabResponseProgressFilterType');
    localStorage.removeItem('sabResponseProgressFilterSequence');
    localStorage.removeItem('sabResponseProgressFilterDepartment');
    localStorage.removeItem('sabResponseProgressFilterStatus');
    localStorage.removeItem('sabResponseProgressFilterDirectorate');
    localStorage.removeItem('sabResponseProgressFilterBehalf');
    localStorage.removeItem('sabResponseProgressFilterMultipleDept');
  }

  exportMSExcel() {
    let url = 'ReminderAndClassificationExportController/exportObservationDepartmentsToExcel?reportCycle=' + this.userInformation.reportCycle + '&reportYear=' + this.userInformation.reportYear;
    window.open(this.mainUrl + url, '_parent');
  }
  exportMSWord() {
    let url = 'ReminderAndClassificationExportController/exportObservationDepartmentsToWord?reportCycle=' + this.userInformation.reportCycle + '&reportYear=' + this.userInformation.reportYear;
    window.open(this.mainUrl + url, '_parent');
  }
  // ReminderAndClassificationExportController/exportObservationDepartmentsToWord?reportCycle=KNPC%20Response%20Report&reportYear=2021-2022
}