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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { SharedVariableService } from '../../services/shared-variable.service';
import { DraggableDialogDirective } from '../../shared/directives/draggable-dialog.directive';
import { SabMember } from '../../models/sab-member.model';
import { SharedModule } from '../../shared/modules/shared.module';

@Component({
  selector: 'app-assign-to-executive',
  standalone: true,
  templateUrl: './assign-to-executive.component.html',
  styleUrls: ['./assign-to-executive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, DraggableDialogDirective],
})
export class AssignToExecutiveComponent {
  /* ------------------ injections ------------------ */
  private readonly shared = inject(SharedVariableService);
  private readonly dialogRef =
    inject<MatDialogRef<AssignToExecutiveComponent>>(MatDialogRef);
  private readonly data = inject<any>(MAT_DIALOG_DATA);

  /* ------------------ RTL signal ------------------ */
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  /* ------------------ dialog context -------------- */
  readonly dialougeType: 'Assign' | 'ReAssign' = this.data.dialougeType;
  private readonly activeParticipants: number =
    this.data.activeParticipants ?? 0;
  private readonly liveItems: number = this.data.execUsers?.liveItems ?? 0;
  readonly hideManagerTab: boolean = !!this.data.isManagerTabHide;

  /* ------------------ data-sources ----------------- */
  readonly dceosDS = new MatTableDataSource<SabMember>(
    (this.data.execUsers.dceos ?? []) as SabMember[]
  );
  readonly managersDS = new MatTableDataSource<SabMember>(
    (this.data.execUsers.managers ?? []) as SabMember[]
  );

  /* ------------------ state signals --------------- */
  /** true → show general-comment textarea; false → per-row comments */
  readonly isGeneralCmntEnabled = signal<boolean>(true);

  /** array of currently selected executives */
  private readonly _selectedExecs = signal<SabMember[]>([]);

  /** expose length for header badge */
  readonly selectedCount = computed(() => this._selectedExecs().length);

  /** group-level comment textarea */
  groupComment = '';

  /* ------ displayed-columns (desktop / mobile) ---- */
  readonly displayedColumns = signal<string[]>([
    'select',
    'loginId',
    'userName',
    'departmentName',
    'cmntButton',
  ]);
  readonly displayedColumnsMob = ['select', 'loginId'] as const;

  /* -------------- assign-button disabled -------------- */
  readonly assignDisabled = computed(() =>
    this.isAssignButtonDisabled(
      this.dialougeType,
      this.liveItems,
      this.activeParticipants,
      this.selectedCount()
    )
  );

  /* ==================== ctor ==================== */
  constructor() {
    /* keep MatTableDataSource filtering reactive */
    this.dceosDS.filterPredicate = this.defaultFilter;
    this.managersDS.filterPredicate = this.defaultFilter;

    this.dialogRef.disableClose = true;
  }

  /* ================= filter helpers =============== */
  filterManagers(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.managersDS.filter = v.trim().toLowerCase();
  }
  filterDCEO(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.dceosDS.filter = v.trim().toLowerCase();
  }
  private defaultFilter(data: SabMember, filter: string): boolean {
    return (
      (data.loginId + data.userName + data.departmentName)
        .toLowerCase()
        .indexOf(filter) !== -1
    );
  }

  /* =============== comment-mode toggles ============== */
  enableRowComments(): void {
    this.isGeneralCmntEnabled.set(false);
    this.displayedColumns.set([
      'select',
      'loginId',
      'userName',
      'departmentName',
      'cmntText',
    ]);
  }
  enableGeneralComment(): void {
    this.isGeneralCmntEnabled.set(true);
    this.displayedColumns.set([
      'select',
      'loginId',
      'userName',
      'departmentName',
      'cmntButton',
    ]);
  }

  /* =============== row checkbox toggle =============== */
  onExecutiveSelection(row: SabMember): void {
    row.checked = !row.checked;
    const sel = [...this._selectedExecs()];
    if (row.checked) {
      sel.push(row);
    } else {
      const idx = sel.findIndex((e) => e.loginId === row.loginId);
      if (idx !== -1) sel.splice(idx, 1);
    }
    this._selectedExecs.set(sel);
  }

  /* =============== textarea change on a row ========= */
  onAddExecutiveComment(row: SabMember): void {
    row.comment = (row.comment ?? '').trim();
    /* ensure the row is in the selection set so comment is captured */
    if (row.checked) {
      this.onExecutiveSelection(row); // will toggle off, so toggle again
      this.onExecutiveSelection(row);
    }
  }

  /* ================= SEND ================= */
  onSendToExecutives(): void {
    this.dialogRef.close({
      event: 'Send',
      data: {
        groupComment: this.groupComment.trim(),
        selectedExecutives: this._selectedExecs(),
      },
    });
  }

  /* ============ legacy truth-table ============ */
  private isAssignButtonDisabled(
    type: 'Assign' | 'ReAssign',
    liveItems: number,
    activeParticipants: number,
    selected: number
  ): boolean {
    /* the original component set *disabled* flag (true → button disabled)   */
    if (selected === 0) return true;

    if (type === 'ReAssign') {
      if (liveItems === 2) {
        return selected !== 1; // enable only when exactly one selected
      }
      if (activeParticipants === 1) return selected > 2;
      if (activeParticipants === 2) return selected !== 1;
      return true;
    }

    /* Assign */
    if (liveItems === 2) return selected !== 1;

    if (activeParticipants === 1) return selected !== 1;
    if (activeParticipants === 0) return selected > 2;

    return true;
  }
}
