import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { SharedVariableService } from '../../services/shared-variable.service';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/modules/shared.module';

/* ────────── tiny helper interface ────────── */
interface Attachment {
  name: string;
  attachedBy: string;
  createdDate: Date | string;
  docId: string;
}

@Component({
  selector: 'app-attachment-list',
  standalone: true,
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class AttachmentListComponent implements OnInit, AfterViewInit {
  /* -------- public view-model -------- */
  readonly displayedColumns = ['name', 'attachedBy', 'createdDate', 'action'];
  readonly dataSource = new MatTableDataSource<Attachment>([]);

  /* -------- view refs -------- */
  @ViewChild(MatSort, { static: true }) private readonly sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  private readonly pager!: MatPaginator;

  /* -------- local signals / props -------- */

  readonly isRtl = inject(SharedVariableService).isRtl$;
  private readonly mainUrl = environment.baseUrl;
  private readonly rawData = inject<Attachment[]>(MAT_DIALOG_DATA);

  /* ---------------------------------------------------- */
  ngOnInit(): void {
    this.dataSource.data = this.rawData ?? [];
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.pager;
  }

  /* -------- download file -------- */
  downloadAttachment(docId: string): void {
    const url = `${this.mainUrl}DownloadController/downloadAttachByDocId?DocId=${docId}`;
    window.open(url, '_parent');
  }
}
