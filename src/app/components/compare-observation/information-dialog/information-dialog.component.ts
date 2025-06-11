import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '../../../shared/modules/shared.module';
import { SharedVariableService } from '../../../services/shared-variable.service';

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class InformationDialog implements OnInit, OnDestroy {
  isRtl = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<InformationDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { autoComparedObsCount: number; totalObs: number },
    private sharedVariableService: SharedVariableService
  ) {
    // Make the dialog non-closable by clicking outside
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.isRtl = value;
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
