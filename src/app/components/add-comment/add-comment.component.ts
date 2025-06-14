import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { SharedVariableService } from '../../services/shared-variable.service';
import { Observable } from 'rxjs';
import { ObsResponse } from '../../models/obs-response.model';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    TranslateModule,
  ],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  form!: FormGroup;
  isAdmin = false;
  isRtl$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObsResponse,
    private sharedVariableService: SharedVariableService
  ) {
    this.dialogRef.disableClose = true;
    this.isRtl$ = this.sharedVariableService.isRtl$;
  }

  ngOnInit(): void {
    const userInfo = JSON.parse(
      localStorage.getItem('sabUserInformation') || '{}'
    );
    this.isAdmin = !!userInfo.admin;

    this.form = new FormGroup({
      comment: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.isAdmin ? 1000 : 256),
      ]),
    });
  }

  get maxLen(): number {
    return this.isAdmin ? 1000 : 256;
  }

  onSend(): void {
    if (this.form.invalid) {
      return;
    }
    const result = { comment: this.form.value.comment.trim() };
    this.dialogRef.close({ event: 'Send', data: result });
  }
}
