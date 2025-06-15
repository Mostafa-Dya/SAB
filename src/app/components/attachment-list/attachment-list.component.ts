import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObservationCard } from 'src/app/models/observation-card.model';
import { ConfigService } from 'src/app/services/config.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.css']
})
export class AttachmentListComponent implements OnInit {
  isRtl: any;
  mainUrl: string;
  displayedColumns: string[] = ['name', 'attachedBy', 'createdDate', 'action'];
  displayedColumnsMob: string[] = ['name'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sharedVariableService: SharedVariableService,
    public dialogRef: MatDialogRef<AttachmentListComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public observation: ObservationCard
    ) { }

  ngOnInit(): void {    
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.dataSource = new MatTableDataSource(this.data.attachment);   
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  downloadAttachment(docId: any) {
    let url = 'DownloadController/downloadAttachByDocId?DocId=' + docId;
    window.open(this.mainUrl + url, '_parent');
  }
}
