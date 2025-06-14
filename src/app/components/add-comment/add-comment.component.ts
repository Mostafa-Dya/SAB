import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  computed,
  signal,
} from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { ObsResponse } from '../../models/obs-response.model';
import { CommentConfigService } from '../../services/comment-config.service';

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
  isAdmin = signal(false);
  readonly isRtl = toSignal(this.sharedVariableService.isRtl$, {
    initialValue: false,
  });
  readonly maxLenSignal = computed(() =>
    this.isAdmin() ? this.config.adminMaxLength : this.config.userMaxLength
  );

  form!: FormGroup<{ comment: FormControl<string> }>;

  constructor(
    private dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObsResponse,
    private sharedVariableService: SharedVariableService,
    private config: CommentConfigService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const userInfo = JSON.parse(
      localStorage.getItem('sabUserInformation') || '{}'
    );
    this.isAdmin.set(!!userInfo.admin);

    this.form = new FormGroup<{ comment: FormControl<string> }>({
      comment: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(this.maxLenSignal())],
      }),
    });
  }


  maxLen(): number {
    return this.maxLenSignal();
  }

  onSend(): void {
    if (this.form.invalid) {
      return;
    }
    const result = { comment: this.form.value.comment.trim() };
    this.dialogRef.close({ event: 'Send', data: result });
  }
}
