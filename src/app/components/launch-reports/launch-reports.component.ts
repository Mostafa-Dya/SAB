import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { CoreService } from 'src/app/services/core.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { ApproveComponent } from '../approve/approve.component';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';

interface Reports {
  value: string;
  name: string;
}

@Component({
  selector: 'app-launch-reports',
  templateUrl: './launch-reports.component.html',
  styleUrls: ['./launch-reports.component.css']
})
export class LaunchReportsComponent implements OnInit {
  selectedReport: any;
  selectedFile: File;
  selectedOption: string;
  isLoading: boolean = false;
  isQ1IntialLaunched: boolean = false;
  isRtl: any;
  isFileSelected: boolean = true;
  @ViewChild('userFile') userFile: ElementRef;

  reports: Reports[] = [
    { value: 'KNPC Response Report', name: 'KNPC_RESPONSE_REPORT' },
    { value: 'SAB Commentary Report', name: 'SAB_COMMENTARY_REPORT' },
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' }
  ];
  userInformation: any;
  reportYear: any;
  loginId: any;
  userName: any;
  isFileError: boolean;
  errorMessage: string;
  isComparisionCompleted: boolean = false;
  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private notification: NzNotificationService,
    public dialog: MatDialog,
    private _loading: LoadingService
  ) { 

  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.reportYear = this.userInformation.reportYear;
    this.loginId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
    this.selectedOption = 'default';
    this.selectedReport = this.reports[0].value;
    this.getUserInfo(false);
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.isFileError = false;
      } else {
        this.isFileError = true;
        this.errorMessage = 'ONLY_DOC';
      }
      this.selectedFile = file;
      this.isFileSelected = true;
    }
  }

  reportChange() {
    this.isFileSelected = true;
    this.isFileError = false;
    this.userFile.nativeElement.value = null;
    this.selectedFile = this.userFile?.nativeElement?.value;
  }

  clearSelectedFile() {
    this.userFile.nativeElement.value = null;
    this.selectedFile = this.userFile.nativeElement.value;
    this.isFileError = false;
  }

  onComplete() {
    let url = 'UserController/getUserInfo?userId=' + this.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response: any) => {
      this._loading.setLoading(false, url);
      this.reportYear = response.reportYear;
      this.loginId = response.sabMember.loginId;
      this.userName = response.sabMember.userName;
      if (response.reportCycle && response.reportCycle == 'SAB Commentary Report') {
        this.isComparisionCompleted = true;
        this.isQ1IntialLaunched = true;
      }
      let extractType;
      if (this.selectedOption == 'default') {
        extractType = 'other';
      } else {
        extractType = 'delimiter';
      }
      if (this.selectedReport == 'KNPC Response Report') {
       
        if (this.selectedFile && !this.isFileError) {
          this.isLoading = true;
          let formData: FormData = new FormData();
          formData.append('report', this.selectedReport);
          formData.append('typeValue', 'launchReport');
          formData.append('extractType', extractType);
          formData.append('Attach', this.selectedFile);
          formData.append('reportYear', this.reportYear);
       
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              dialogHeader: 'COMPLETE_LAUNCHING',
              dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT',
              reportCycle: 'Initial Report'
            }
          });
          dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
              let url = 'launchObservations/launchIntialReport';
              this._loading.setLoading(true, url);
              this.coreService.post(url, formData).subscribe((response: any) => {
                this.isLoading = false;
                this._loading.setLoading(false, url);
                if (response.type != 'Failure') {
                  this.getUserInfo(true);
                  const dialogRef = this.dialog.open(ExtractionCompleteDialogComponent, {
                    width: '400px',
                    data: response
                  });
                  this.router.navigate(['/extractReports']);
                } else {
                  this.notification.create('error', 'Error', response.message);
                }
              }, error => {
                this.isLoading = false;
                this._loading.setLoading(false, url);
                this.notification.create('error', 'Error', error);
              })
            }
          });
  
        } else {
          this.isFileSelected = false;
        }
      } else if (this.selectedReport == 'SAB Commentary Report') {
        if (!this.isQ1IntialLaunched) {
          if (this.selectedFile && !this.isFileError) {
            this.isLoading = true;
            let formData: FormData = new FormData();
            formData.append('report', this.selectedReport);
            formData.append('typeValue', 'launchReport');
            formData.append('extractType', extractType);
            formData.append('Attach', this.selectedFile);
            formData.append('reportYear', this.reportYear);
            //let reportName = '';
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: {
                dialogHeader: 'COMPLETE_LAUNCHING',
                dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT',
                reportCycle: this.selectedReport
              }
            });
            dialogRef.afterClosed().subscribe(confirmed => {
              if (confirmed) {
                let url = 'launchObservations/launchIntialReport';
                this._loading.setLoading(true, url);
                this.coreService.post(url, formData).subscribe((response: any) => {
                  this.isLoading = false;
                  this._loading.setLoading(false, url);
                  if (response.type != 'Failure') {
                    this.getUserInfo(true);
                    const dialogRef = this.dialog.open(ExtractionCompleteDialogComponent, {
                      width: '400px',
                      data: response
                    });
                    this.router.navigate(['/extractReports']);
                  } else {
                    this.notification.create('error', 'Error', response.message);
                  }
                }, error => {
                  this.isLoading = false;
                  this._loading.setLoading(false, url);
                  console.log('error :' , error);
                  this.notification.create('error', 'Error', error);
                })
              }
            });
  
          } else {
            this.isFileSelected = false;
          }
        } else {
          // this.isFileSelected = false;
          this.isLoading = true;
          let formData: FormData = new FormData();
          formData.append('report', this.selectedReport);
          formData.append('typeValue', 'DirectLaunch');
          formData.append('reportYear', this.reportYear)
          formData.append('extractType', '');
          let url = 'launchObservations/launchIntialReport';
          this._loading.setLoading(true, url);
          // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          //   data: {
          //     dialogHeader: 'COMPLETE_LAUNCHING',
          //     dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT'
          //   }
          // });
          // dialogRef.afterClosed().subscribe(confirmed => {
          //   if (confirmed) {
              // let url = 'launchObservations/launchIntialReport';
              this._loading.setLoading(true, url);
              this.coreService.post(url, formData).subscribe((response: any) => {
                this.isLoading = false;
                this._loading.setLoading(false, url);
                if (response.type != 'Failure') {
                  this.getUserInfo(true);
                  this.clearFilter();
                  this.router.navigate(['/inbox']);
                } else {
                  this.notification.create('error', 'Error', response.message);
                }
              }, error => {
                this.isLoading = false;
                this._loading.setLoading(false, url);
                console.log('error  :', error);
                this.notification.create('error', 'Error', error);
                })
        //    }
        //  });
        }
      } else {
        this.isLoading = true;
        let formData: FormData = new FormData();
        formData.append('report', this.selectedReport);
        formData.append('typeValue', 'DirectLaunch');
        formData.append('extractType', '');
        formData.append('reportYear', this.reportYear)
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            dialogHeader: 'COMPLETE_LAUNCHING',
            dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_LAUNCH_THIS_REPORT',
            reportCycle: this.selectedReport
          }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
          if (confirmed) {
            let url = 'launchObservations/launchIntialReport';
            this._loading.setLoading(true, url);
            this.coreService.post(url, formData).subscribe((response: any) => {
              this.isLoading = false;
              this._loading.setLoading(false, url);
              if (response.type != 'Failure') {
                this.getUserInfo(true);
                this.clearFilter();
                this.router.navigate(['/inbox']);
              } else {
                this.notification.create('error', 'Error', response.message);
              }
            }, error => {
              this.isLoading = false;
              this._loading.setLoading(false, url);
              console.log('error  :', error);
              this.notification.create('error', 'Error', error);
            })
          }
        });
      }
    }, error => {
      console.log('error  :', error);
    })
  }

  getUserInfo(updateLocalstorage:boolean) {
    let url = 'UserController/getUserInfo?userId=' + this.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response: any) => {
      this._loading.setLoading(false, url);
      this.reportYear = response.reportYear;
      this.loginId = response.sabMember.loginId;
      this.userName = response.sabMember.userName;
      if(updateLocalstorage){
        localStorage.setItem('sabUserInformation', JSON.stringify(response));
      }      
      if (response.reportCycle && response.reportCycle == 'SAB Commentary Report') {
        this.isComparisionCompleted = true;
        this.isQ1IntialLaunched = true;
      }
      this.sharedVariableService.setReportYearValue(response.reportYear);
    }, error => {
      console.log('error  :', error);
    })
  }

  changeDepartment() {
    // this.selectedReport = 'SAB Quarterly Report Q1';
    this.router.navigate(['launchReports/change-department', this.selectedReport]);
  }

  directReport() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DIRECT_REPORT',
        dialogMessage: 'ARE_YOU_SURE_YOU_WANT_TO_COMPLETE_Q3_REPORT_WITH_SA2_RESPONSE'
      }
    });
    let url = 'launchObservations/completeObservationWithOutLaunch?reportYear=' + this.reportYear + '&reportCycle=' + this.selectedReport + '&userName=' + this.userName + '&userId=' + this.loginId+ '&logInId=' + this.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;       
        this._loading.setLoading(true, url);
        this.coreService.get(url).subscribe((response: any) => {
          this.isLoading = false;
          this._loading.setLoading(false, url);
          if (response.type != 'Failure') {
            this.getUserInfo(true);
            this.notification.create('success', 'Success', response.message);
          } else {
            this.notification.create('error', 'Error', response.message);
          }
        }, error => {
          this.isLoading = false;
          this._loading.setLoading(false, url);
          console.log('error  :', error);
          this.notification.create('error', 'Error', error);
        })
      }
    });

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
}

@Component({
  selector: 'extraction-complete-dialog',
  templateUrl: 'extraction-complete.component.html',
  styleUrls: ['./launch-reports.component.css']
})
export class ExtractionCompleteDialogComponent {
  isRtl: any;
  informationData: any;

  constructor(
    public dialogRef: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: any,
    private sharedVariableService: SharedVariableService
  ) {
    this.informationData = responseData.message;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
