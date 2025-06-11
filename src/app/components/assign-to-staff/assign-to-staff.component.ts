import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SharedVariableService } from '../../services/shared-variable.service';
import { StaffMemebr } from '../../models/staff-member.model';
import { DraggableDialogDirective } from '../../shared/directives/draggable-dialog.directive';
import { SharedModule } from '../../shared/modules/shared.module';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-assign-to-staff',
  standalone: true,
  templateUrl: './assign-to-staff.component.html',
  styleUrls: ['./assign-to-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,
    DraggableDialogDirective,
  ],
})
export class AssignToStaffComponent {
  /* ---------------- injections ---------------- */
  private readonly shared = inject(SharedVariableService);
  private readonly dialogRef =
    inject<MatDialogRef<AssignToStaffComponent>>(MatDialogRef);
  public readonly data = inject<any>(MAT_DIALOG_DATA);

  /* ---------------- rtl ----------------------- */
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  /* ------- dialog context & DS ---------------- */
  readonly dialougeType: 'ASSIGN_STAFF' | 'RE_ASSIGN_STAFF' =
    this.data.dialougeType;
  private readonly activeParticipants: number = this.data.activeParticipants ?? 0;
  private readonly liveItems: number = this.data.departmentData?.liveItems ?? 0;

  readonly tlDS = new MatTableDataSource<StaffMemebr>(
    (this.data.departmentData.tls ?? []) as StaffMemebr[]
  );
  readonly engDS = new MatTableDataSource<StaffMemebr>(
    (this.data.departmentData.engs ?? []) as StaffMemebr[]
  );

  /* ---------------- state signals ------------- */
  readonly isGeneralCmntEnabled = signal<boolean>(true);
  private readonly _selected = signal<StaffMemebr[]>([]);
  readonly selectedCount = computed(() => this._selected().length);

  readonly displayedColumns = signal<string[]>([
    'select',
    'loginId',
    'userName',
    'ecmJobTitle',
    'cmntButton',
  ]);
  readonly displayedColumnsMob = ['select', 'loginId'] as const;

  groupComment = '';
  readonly btnLabel =
    this.dialougeType === 'ASSIGN_STAFF' ? 'ASSIGN' : 'RE_ASSIGN';

  readonly assignDisabled = computed(() =>
    this.disableButton(
      this.dialougeType,
      this.liveItems,
      this.activeParticipants,
      this.selectedCount(),
      this._selected().map((s) => s.divisionCode)
    )
  );

  constructor() {
    this.dialogRef.disableClose = true;
  }

  /* ========== selection & comment ========== */
  onStaffSelection(row: StaffMemebr): void {
    row.checked = !row.checked;
    const sel = [...this._selected()];
    row.checked ? sel.push(row) : sel.splice(sel.indexOf(row), 1);
    this._selected.set(sel);
  }

  onAddStaffComment(row: StaffMemebr): void {
    row.comment = (row.comment ?? '').trim();
    if (row.checked) {
      this.onStaffSelection(row);
      this.onStaffSelection(row);
    }
  }

  /* ========== comment mode toggle ========== */
  enableRowComments(): void {
    this.isGeneralCmntEnabled.set(false);
    this.displayedColumns.set([
      'select',
      'loginId',
      'userName',
      'ecmJobTitle',
      'cmntText',
    ]);
  }
  enableGeneralComment(): void {
    this.isGeneralCmntEnabled.set(true);
    this.displayedColumns.set([
      'select',
      'loginId',
      'userName',
      'ecmJobTitle',
      'cmntButton',
    ]);
  }

  /* ================= SEND ================= */
  onSendToDepartments(): void {
    this.dialogRef.close({
      event: 'Send',
      data: {
        groupComment: this.groupComment.trim(),
        selectedStaff: this._selected(),
      },
    });
  }

  /* ========== enable/disable logic ========== */
  private disableButton(
    type: 'ASSIGN_STAFF' | 'RE_ASSIGN_STAFF',
    liveItems: number,
    active: number,
    sel: number,
    divisions: number[]
  ): boolean {
    if (sel === 0) return true;
    if (sel === 2 && divisions[0] === divisions[1]) return true;

    const re = type === 'RE_ASSIGN_STAFF';

    if (liveItems === 2) return sel !== 1;

    if (active === 1) return sel > (re ? 2 : 1);
    if (!re && active === 0) return sel > 2;
    if (re && active === 2) return sel !== 1;

    return false;
  }
}
