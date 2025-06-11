import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedVariableService } from '../../services/shared-variable.service';
import { Observable } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';

/** What the dialog receives from its opener */
export interface DepartmentDto {
  departmentName: string;
}

@Component({
  selector: 'app-change-department-info-dialog',
  standalone: true,
  templateUrl: './change-department-info-dialog.component.html',
  styleUrls: ['./change-department-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class ChangeDepartmentInfoDialogComponent {
  /** RTL stream – used directly in the template with async pipe */
  readonly isRtl$: Observable<boolean> = inject(SharedVariableService).isRtl$;

  constructor(
    public dialogRef: MatDialogRef<ChangeDepartmentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: DepartmentDto[]
  ) {}
}
