import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObservationCard } from 'src/app/models/observationCard.model';
import { ConfigService } from 'src/app/services/config.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-archive-response-notes',
  templateUrl: './archive-response-notes.component.html',
  styleUrls: ['./archive-response-notes.component.css']
})
export class ArchiveResponseNotesComponent implements OnInit {
  isRtl: any;
  mainUrl: string;
  displayedColumns: string[] = ['addedDate', 'addedBy', 'departmentName','notes'];
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
    ) { }

  ngOnInit(): void {    
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    this.dataSource = new MatTableDataSource(this.data.notes);   
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

}
