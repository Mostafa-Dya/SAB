import {
  Component,
  Inject,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { toSignal } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';

/**
 * Represents a single row in the contact-person table.
 */
export interface ContactPersonRow {
  userName: string;
  userMail: string;
  userLogin: string;   
  department: string;
}

@Component({
  standalone: true,
  selector: 'app-contact-person-details',
  templateUrl: './contact-person-details.component.html',
  styleUrls: ['./contact-person-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class ContactPersonDetailsComponent implements AfterViewInit {
  /** Whether layout is RTL */
  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  /** The data source for our table */
  readonly dataSource = new MatTableDataSource<ContactPersonRow>(
    this.data.dialogData
  );

  /** Columns in the table */
  readonly displayedColumns: string[] = [
    'userName',
    'userMail',
    'userLogin',
    'department',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ContactPersonDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogHeader: string; dialogData: ContactPersonRow[] },
    private shared: SharedVariableService
  ) {
    // Prevent closing this dialog by clicking outside
    dialogRef.disableClose = true;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Close the dialog with final data if needed
   */
  save(): void {
    this.dialogRef.close({ event: 'Send', data: this.data });
  }

}
