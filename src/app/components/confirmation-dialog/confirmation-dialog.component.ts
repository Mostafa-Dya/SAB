import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ConformationData } from '../../models/conformation-data.model';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';

@Component({
  standalone: true,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  imports: [SharedModule],
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  dialogHeader: string;
  dialogMessage: string;
  isRtl = false;
  comment = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConformationData,
    private sharedVariableService: SharedVariableService
  ) {
    this.dialogHeader = data.dialogHeader;
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit(): void {
    // Subscribe to RTL flag
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => {
        this.isRtl = rtl;
      });
  }

  /**
   * Triggered when the user clicks "YES" in the dialog.
   */
  onClickYes(): void {
    const result = {
      comment: this.comment.trim(),
    };
    this.dialogRef.close({ event: 'Send', data: result });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
