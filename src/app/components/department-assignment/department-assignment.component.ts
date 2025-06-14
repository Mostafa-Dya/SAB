import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

import { Directorate } from '../../models/directorate.model';
import { Manager } from '../../models/manager.model';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { DraggableDialogDirective } from '../../shared/directives/draggable-dialog.directive';

@Component({
  selector: 'app-department-assignment',
  standalone: true,
  templateUrl: './department-assignment.component.html',
  styleUrls: ['./department-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SharedModule, DraggableDialogDirective],
})
export class DepartmentAssignmentComponent {
  private readonly dialogRef =
    inject<MatDialogRef<DepartmentAssignmentComponent>>(MatDialogRef);
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly shared = inject(SharedVariableService);

  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  readonly displayedColumns = signal<string[]>([
    'select',
    'departmentName',
    'loginId',
    'userName',
    'cmntButton',
  ]);
  readonly displayedColumnsMob = ['select', 'departmentName'] as const;
  readonly isGeneralCmntEnabled = signal(true);
  private readonly _selectedManagers = signal<Manager[]>([]);
  readonly selectedCount = computed(() => this._selectedManagers().length);

  groupComment = '';

  readonly directoratesList: Directorate[] = this.data.directoratesList;
  readonly noOfactiveDepts: number = this.data.noOfActiveDepts;

  constructor() {
    this.dialogRef.disableClose = true;
  }

  removeTableComments(): void {
    this.isGeneralCmntEnabled.set(true);
    this.displayedColumns.set([
      'select',
      'departmentName',
      'loginId',
      'userName',
      'cmntButton',
    ]);
  }

  addTableComments(): void {
    this.isGeneralCmntEnabled.set(false);
    this.displayedColumns.set([
      'select',
      'departmentName',
      'loginId',
      'userName',
      'cmntText',
    ]);
  }

  onSendToDepartments(): void {
    this.dialogRef.close({
      event: 'Send',
      data: {
        groupComment: this.groupComment.trim(),
        selectedManagers: this._selectedManagers(),
      },
    });
  }

  onManagerSelection(manager: Manager): void {
    manager.checked = !manager.checked;
    const arr = [...this._selectedManagers()];
    if (manager.checked) {
      arr.push(manager);
    } else {
      const idx = arr.findIndex((m) => m.loginId === manager.loginId);
      if (idx !== -1) arr.splice(idx, 1);
    }
    this._selectedManagers.set(arr);
  }

  onAddManagerComment(manager: Manager): void {
    manager.comment = (manager.comment ?? '').trim();
    if (manager.checked) {
      this.onManagerSelection(manager);
      this.onManagerSelection(manager);
    }
  }
}
