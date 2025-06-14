import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subject, takeUntil } from 'rxjs';

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
  imports: [
    SharedModule
  ]
})
export class ContactPersonDetailsComponent implements OnInit, OnDestroy {
  /** Whether layout is RTL */
  isRtl = false;

  /** The data source for our table */
  dataSource!: MatTableDataSource<ContactPersonRow>;

  /** Columns in the table */
  displayedColumns: string[] = [
    'userName',
    'userMail',
    'userLogin',
    'department'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ContactPersonDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogHeader: string; dialogData: ContactPersonRow[] },
    private sharedVariableService: SharedVariableService
  ) {
    // Prevent closing this dialog by clicking outside
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    // Subscribe to RTL changes
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => {
        this.isRtl = rtl;
      });

    // Initialize table data
    this.dataSource = new MatTableDataSource(this.data.dialogData);
    // Optionally, you can log the data to debug:
    // console.log('ContactPersonDetails data:', this.data);
  }

  /**
   * Close the dialog with final data if needed
   */
  save(): void {
    this.dialogRef.close({ event: 'Send', data: this.data });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
