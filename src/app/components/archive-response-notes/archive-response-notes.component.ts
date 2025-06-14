import { Component, OnInit, Inject, ViewChild, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { ObservationCard } from '../../models/observation-card.model';
import { ConfigService } from '../../services/config.service';
import { SharedVariableService } from '../../services/shared-variable.service';

@Component({
  selector: 'app-archive-response-notes',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './archive-response-notes.component.html',
  styleUrls: ['./archive-response-notes.component.scss'],
})
export class ArchiveResponseNotesComponent implements OnInit {
  isRtl = signal(false);
  displayedColumns: string[] = [
    'addedDate',
    'addedBy',
    'departmentName',
    'notes',
  ];
  displayedColumnsMob: string[] = ['name'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sharedVariableService: SharedVariableService,
    public dialogRef: MatDialogRef<ArchiveResponseNotesComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public observation: ObservationCard
  ) {}

  ngOnInit(): void {
    this.sharedVariableService.isRtl$.subscribe((v) => this.isRtl.set(v));

    this.dataSource = new MatTableDataSource(this.data.notes);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
}
