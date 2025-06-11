import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Manager } from '../../models/manager.model';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { Directorate } from '../../models/directorate.model';

@Component({
  standalone: true,
  selector: 'app-declined-by-manager',
  templateUrl: './declined-by-manager.component.html',
  styleUrls: ['./declined-by-manager.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class DeclinedByManagerComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['select', 'departmentName'];
  /** Whether the general comment text area is visible */
  isGeneralCmntEnabled = true;
  /** The selected manager objects from multiple directorates. */
  selectedManagers: Manager[] = [];
  /** The group comment (comment for all). */
  groupComment = '';
  /** Directorates list passed in via MAT_DIALOG_DATA */
  directoratesList: Directorate[] = [];
  /** The number of active departments */
  noOfactiveDepts = 0;
  /** The current department code (to disable selection on the same dept) */
  currentDeptCode: any;
  /** The current department name to compare with (removing from the list) */
  departmentName: string | undefined;

  /** Whether layout is RTL */
  isRtl = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DeclinedByManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private sharedVariableService: SharedVariableService
  ) {
    // Make the dialog non-closable by clicking outside
    dialogRef.disableClose = true;

    // Initialize data from the response
    this.directoratesList = response.directoratesList;
    this.noOfactiveDepts = response.noOfActiveDepts;
    this.departmentName = response.deprtment;
  }

  ngOnInit(): void {
    // Subscribe to RTL changes
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => {
        this.isRtl = rtl;
      });

    // Remove the manager that matches the same department name
    if (this.departmentName) {
      for (const directorate of this.directoratesList) {
        const { managersList } = directorate;
        for (let j = managersList.length - 1; j >= 0; j--) {
          const managerDept = managersList[j].departmentName
            .trim()
            .toLowerCase();
          if (managerDept === this.departmentName.trim().toLowerCase()) {
            managersList.splice(j, 1);
          }
        }
      }
    }
  }

  /**
   * Show or hide general comment area
   */
  removeTableComments(): void {
    this.isGeneralCmntEnabled = true;
    this.displayedColumns = ['select', 'departmentName'];
  }

  /**
   * (Not currently used) toggles the general comment
   */
  addTableComments(): void {
    this.isGeneralCmntEnabled = false;
    this.displayedColumns = ['select', 'departmentName'];
  }

  /**
   * Called when user clicks "SEND"
   */
  onSendToDepartments(): void {
    let managerStr = '';
    this.selectedManagers.forEach((mgr, idx) => {
      managerStr += mgr.departmentName;
      if (idx < this.selectedManagers.length - 1) {
        managerStr += ', ';
      }
    });

    const result = {
      groupComment: this.groupComment.trim(),
      selectedManagers: managerStr,
    };

    this.dialogRef.close({ event: 'Send', data: result });
  }

  /**
   * Called whenever a manager is toggled
   */
  onManagerSelection(manager: Manager): void {
    if (manager.checked) {
      this.selectedManagers.push(manager);
    } else {
      this.selectedManagers = this.selectedManagers.filter(
        (item) => item.departmentCode !== manager.departmentCode
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
