import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedVariableService } from '../../services/shared-variable.service';
import { ObsResponse } from '../../models/obs-response.model';
import { DraggableDialogDirective } from '../../shared/directives/draggable-dialog.directive';
import { SharedModule } from '../../shared/modules/shared.module';

@Component({
  selector: 'app-cancel-send-back',
  standalone: true,
  templateUrl: './cancel-send-back.component.html',
  styleUrls: ['./cancel-send-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,
    DraggableDialogDirective,
  ],
})
export class CancelSendBackComponent implements OnInit {
  /* ───────────── injections ───────────── */
  private readonly shared = inject(SharedVariableService);
  private readonly dialogRef =
    inject<MatDialogRef<CancelSendBackComponent>>(MatDialogRef);
  private readonly data = inject<ObsResponse>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  /* ───────────── view-state ───────────── */
  readonly isRtl = this.shared.isRtl$;
  userInfo!: { admin: boolean }; // filled in ngOnInit

  /** Reactive form */
  readonly form = this.fb.group({
    isSkipMail: [true],
    comment: ['', []], // validators filled in ngOnInit
  });

  /* ───────────── life-cycle ───────────── */
  ngOnInit(): void {
    /** read user information from localStorage once */
    this.userInfo = JSON.parse(localStorage.getItem('sabUserInformation') ?? '{}');

    /* comment validators: required & maxLen for non-admin */
    const max = this.userInfo.admin ? 1000 : 256;
    const validators = this.userInfo.admin
      ? [Validators.maxLength(max)]
      : [Validators.required, Validators.maxLength(max)];

    this.form.controls.comment.setValidators(validators);
    this.form.controls.comment.updateValueAndValidity();

    this.dialogRef.disableClose = true;
  }

  /* ───────────── helpers ───────────── */
  commentLength(): number {
    return (this.form.controls.comment.value ?? '').trim().length;
  }

  /* ───────────── SEND handler ───────────── */
  onSend(): void {
    if (this.form.invalid) return;

    const payload = {
      isSkipMail: this.form.controls.isSkipMail.value,
      comment: (this.form.controls.comment.value ?? '').trim(),
    };

    this.dialogRef.close({ event: 'Send', data: payload });
  }
}
