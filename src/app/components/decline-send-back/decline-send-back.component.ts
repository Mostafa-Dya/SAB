import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ObsResponse } from '../../models/obs-response.model';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';



@Component({
  standalone: true,
  selector: 'app-decline-send-back',
  templateUrl: './decline-send-back.component.html',
  styleUrls: ['./decline-send-back.component.scss'],
  imports: [
    SharedModule
  ]
})
export class DeclineSendBackComponent implements OnInit, OnDestroy {
  isRtl = false;
  comment = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DeclineSendBackComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService
  ) {
    // Make the dialog non-closable by clicking outside
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    // Subscribe to the RTL value
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => {
        this.isRtl = rtl;
      });
  }

  /**
   * When user clicks "Send" button
   */
  onSend(): void {
    const trimmed = this.comment.trim();
    this.dialogRef.close({
      event: 'Send',
      data: { comment: trimmed }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
