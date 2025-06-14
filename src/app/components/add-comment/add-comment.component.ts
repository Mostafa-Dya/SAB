import { Component, Inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { DialogHeaderComponent } from '../../shared/dialog-header/dialog-header.component';



@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    ReactiveFormsModule,
    DialogHeaderComponent,
  ],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent {
  isRtl = signal(false);
  comment = this.fb.nonNullable.control('');
  isReasonFirst: any = true;

  showError: boolean;
  userInformation: any;

  constructor(
    public dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService,
    private fb: NonNullableFormBuilder
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl.set(value);
    });

    const data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isReasonFirst = false;
  }

  onSend(): void {
    var _result;
    if (this.userInformation.admin) {

      _result = {
        comment: this.comment.value.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    } else {
      // if (this.comment == undefined) {
      //   this.comment = '';
      // }
      _result = {
        comment: this.comment.value.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    }
  }

}
