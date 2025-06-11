import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SharedVariableService } from '../../services/shared-variable.service';
import { DraggableDialogDirective } from '../../shared/directives/draggable-dialog.directive';
import { SharedModule } from '../../shared/modules/shared.module';

interface Committee {
  departmentCode: number;
  departmentName: string;
  directorateCode: number;
  directorateName: string;
  divisionCode: number;
  loginId: string;
  userName: string;
  userJobTitle: string;
}
interface CommitteeGroup {
  jobTitle: string;
  committee: Committee[];
}

@Component({
  selector: 'app-assign-to-committee',
  standalone: true,
  templateUrl: './assign-to-committee.component.html',
  styleUrls: ['./assign-to-committee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DraggableDialogDirective, SharedModule],
})
export class AssignToCommitteeComponent {
  /* ---------------- view refs ---------------- */
  @ViewChild('auto', { static: false })
  private readonly auto!: MatAutocompleteTrigger;

  /* --------------- injected --------------- */
  private readonly shared = inject(SharedVariableService);
  private readonly dialogRef = inject(MatDialogRef<AssignToCommitteeComponent>);
  private readonly data = inject<any>(MAT_DIALOG_DATA);

  /* --------------- rtl -------------------- */
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  /* --------------- dialog flavour --------- */
  readonly dialougeType: string = this.data.dialougeType;

  /* --------------- form controls ---------- */
  readonly committeeControl = new FormControl<string>('', {
    nonNullable: true,
  });
  readonly formattedControl = new FormControl<string>('', {
    nonNullable: true,
  });

  /* --------------- raw groups ------------- */
  readonly committeeGroups: CommitteeGroup[] = [
    { jobTitle: 'CEO', committee: this.data.committeeusers.committeeHeadCEOs },
    {
      jobTitle: 'DCEO',
      committee: this.data.committeeusers.committeeHeadDCEOs,
    },
    {
      jobTitle: 'Manager',
      committee: this.data.committeeusers.committeeHeadManagers,
    },
    {
      jobTitle: 'Team Leader',
      committee: this.data.committeeusers.committeeHeadTls,
    },
  ];

  readonly formattedGroups: CommitteeGroup[] = [
    { jobTitle: 'CEO', committee: this.data.committeeusers.formatterCEOs },
    { jobTitle: 'DCEO', committee: this.data.committeeusers.formatterDCEOs },
  ];

  /* --------------- runtime picks ---------- */
  selectedHead?: Committee;
  selectedFormatter?: Committee;

  /* --------------- computed streams ------- */
  readonly filteredOptions$: Observable<CommitteeGroup[]> =
    this.committeeControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this.filterCommittees(value) : this.committeeGroups
      ),
      takeUntilDestroyed()
    );

  constructor() {
    this.dialogRef.disableClose = true;
  }

  /* =================  helpers  ================= */

  private filterCommittees(value: string): CommitteeGroup[] {
    const term = value.toLowerCase();
    const result: CommitteeGroup[] = [];

    for (const grp of this.committeeGroups) {
      const matches = grp.committee.filter(
        (c) =>
          c.userName.toLowerCase().includes(term) ||
          c.loginId.toLowerCase().includes(term) ||
          grp.jobTitle.toLowerCase().includes(term)
      );
      if (matches.length) {
        result.push({ jobTitle: grp.jobTitle, committee: matches });
      }
    }
    return result;
  }

  /** clear the selected head & reopen autocomplete */
  clearHead(): void {
    this.selectedHead = undefined;
    this.committeeControl.setValue('');
    queueMicrotask(() => this.auto?.openPanel());
  }

  /** user picked a committee head */
  headPicked(c: Committee): void {
    this.selectedHead = c;
    this.committeeControl.setValue(`${c.loginId} - ${c.userName}`);
    // Narrow formatter list only after head chosen
  }

  /** user picked a formatter */
  formatterPicked(c: Committee): void {
    this.selectedFormatter = c;
  }

  /** primary action (Assign / Change / Re-Assign) */
  submit(): void {
    this.dialogRef.close({
      event: 'Send',
      data: {
        groupComment: this.groupComment.trim(),
        selectedHeads: this.selectedHead,
        selectedFormatters: this.selectedFormatter,
      },
    });
  }

  /* =============== template-bound fields =============== */
  groupComment = '';
}
