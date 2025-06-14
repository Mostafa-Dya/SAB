import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { SharedVariableService } from '../../services/shared-variable.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ObservationNote } from '../../models/observation-note.model';

@Component({
  selector: 'app-archive-response-notes',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './archive-response-notes.component.html',
  styleUrls: ['./archive-response-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveResponseNotesComponent implements OnInit {
  readonly isRtl = toSignal(this.sharedVariableService.isRtl$, {
    initialValue: false,
  });

  readonly displayedColumns: string[] = [
    'addedDate',
    'addedBy',
    'departmentName',
    'notes',
  ];

  readonly dataSource = new MatTableDataSource<ObservationNote>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sharedVariableService: SharedVariableService,
    public dialogRef: MatDialogRef<ArchiveResponseNotesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { notes: ObservationNote[] }
  ) {}

  ngOnInit(): void {
    this.dataSource.data = this.data.notes;
    queueMicrotask(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
}
