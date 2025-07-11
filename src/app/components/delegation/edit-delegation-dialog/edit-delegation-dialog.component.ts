import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import * as moment from 'moment';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@Component({
  selector: 'app-edit-delegation-dialog',
  templateUrl: './edit-delegation-dialog.component.html',
  styleUrls: ['./edit-delegation-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class EditDelegationDialogComponent implements OnInit {
  delegateFrom: any;
  minDate = new Date();
  minToDate = new Date();
  isToDisable = true;
  editDelegateUserForm: FormGroup;
  isLoading: boolean = false;
  fromDate: any;
  toDate: any;
  updateData: any;
  isButtonDisabled = false;
  msg: any = '';
  constructor(private sharedVariableService: SharedVariableService, private fb: FormBuilder, private coreService: CoreService,
    private _loading: LoadingService,
    private notification: NzNotificationService,
    public dialogRef: MatDialogRef<EditDelegationDialogComponent>, private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const updateData = this.data;
    this.updateData = JSON.parse(updateData)

  }

  compareDates() {
    if (this.updateData.delegationFrom && this.updateData.delegationTo) {
      const fromDateTime = new Date(this.updateData.delegationFrom).getTime();
      const toDateTime = new Date(this.updateData.delegationTo).getTime();
      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled) {
        this.msg = " should be greater than "
      }else {
        this.isButtonDisabled = false;
        this.msg = ''
        console.log(this.msg );
      }
    }
  }

  changeFrom(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.minToDate = event.value;
      this.isToDisable = false;
    } else {
      this.isToDisable = true;
    }

    if (this.updateData.delegationFrom && this.updateData.delegationTo) {
      const fromDateTime = new Date(this.updateData.delegationFrom).getTime();
      const toDateTime = new Date(this.updateData.delegationTo).getTime();

      this.isButtonDisabled = toDateTime < fromDateTime;
      if(this.isButtonDisabled) {
        this.msg = " should be greater than "
      }else {
        this.isButtonDisabled = false;
        this.msg = ''
        console.log(this.msg );
      }

      // this.ref.detectChanges();

    } 
  }

  editDelegateUser() {
    let url = 'UserController/updateDelegation'
    let body = {
      id: this.updateData.id,
      addedLoginId: this.updateData.addedByLoginId,
      addedUserName: this.updateData.addedByUserName,
      delegateFrom: moment(new Date(this.updateData.delegationFrom).toString()).format('DD/MM/YYYY'),
      delegateReason: this.updateData.delegationReason,
      delegateTo: moment(new Date(this.updateData.delegationTo).toString()).format('DD/MM/YYYY'),
      fromJobTitle: this.updateData.fromJobTitle,
      fromLoginId: this.updateData.fromLoginId,
      fromUserName: this.updateData.fromUserName,
      toJobTitle: this.updateData.toJobTitle,
      toLoginId: this.updateData.toLoginId,
      toUserName: this.updateData.toUserName
    }
    this.coreService.post(url, body).subscribe(response => {
      console.log(response: any);
      
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.dialogRef.close({ 'event': response }); 
      this.notification.create(
        "success",
        "Success",
        "Delegation edited successfully"
      );
     
    }, error => {
      console.log(error);
      
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.notification.create('error', 'Error', "Failed to update delegation");
      console.log('error :', error);
    });
  }

}
