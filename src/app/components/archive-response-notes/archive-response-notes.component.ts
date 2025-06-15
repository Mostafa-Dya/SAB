// src/app/archive-response-notes/archive-response-notes.component.ts
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

import { SharedVariableService } from '../../services/shared-variable.service';
import { ObservationCard } from '../../models/observation-card.model';

@Component({
  selector: 'app-archive-response-notes',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    DragDropModule,
    TranslateModule,
  ],
  templateUrl: './archive-response-notes.component.html',
  styleUrls: ['./archive-response-notes.component.scss'],
})
export class ArchiveResponseNotesComponent implements OnInit, AfterViewInit {
  public isRtl$: Observable<boolean>;
  public displayedColumns = [
    'addedDate',
    'addedBy',
    'departmentName',
    'notes',
  ];
  public dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sharedVariableService: SharedVariableService,
    public dialogRef: MatDialogRef<ArchiveResponseNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notes: any[]; obs: ObservationCard }
  ) {
    this.isRtl$ = this.sharedVariableService.isRtl$;
  }

  ngOnInit(): void {
    this.dataSource.data = this.data.notes || [];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
