import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DraggableDialogDirective } from '../../../shared/directives/draggable-dialog.directive';
import { format } from 'date-fns';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DelegatedUser } from '../../../models/delegation.model';
@Component({
  selector: 'app-edit-delegation-dialog',
  standalone: true,
  templateUrl: './edit-delegation-dialog.component.html',
  styleUrls: ['./edit-delegation-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DraggableDialogDirective
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en-GB' }]
})
export class EditDelegationDialogComponent implements OnInit {
  minDate = new Date();
  minToDate = new Date();
  isToDisable = true;
  isLoading: boolean = false;
  updateData!: DelegatedUser;
  isButtonDisabled = false;
  msg = '';
  constructor(
    private coreService: CoreService,
    private _loading: LoadingService,
    private notification: NzNotificationService,
    public dialogRef: MatDialogRef<EditDelegationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
    const url = 'UserController/updateDelegation';
    const body = {
      id: this.updateData.id,
      addedLoginId: this.updateData.addedByLoginId,
      addedUserName: this.updateData.addedByUserName,
      delegateFrom: format(new Date(this.updateData.delegationFrom), 'dd/MM/yyyy'),
      delegateReason: this.updateData.delegationReason,
      delegateTo: format(new Date(this.updateData.delegationTo), 'dd/MM/yyyy'),
      fromJobTitle: this.updateData.fromJobTitle,
      fromLoginId: this.updateData.fromLoginId,
      fromUserName: this.updateData.fromUserName,
      toJobTitle: this.updateData.toJobTitle,
      toLoginId: this.updateData.toLoginId,
      toUserName: this.updateData.toUserName
    };
    this.coreService.post(url, body).subscribe(response => {
      console.log(response);
      
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
