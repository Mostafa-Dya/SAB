import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';



import { ArchiveResponseNotesComponent } from '../archive-response-notes/archive-response-notes.component';
import { ArchivedResponseContentComponent } from '../archived-response-content/archived-response-content.component';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { SharedVariableService } from '../../services/shared-variable.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';

export interface ObservationData {
  cycle: string;
  from: string;
  to: string;
  stepName: string;
  dept: string;
  dateTime: string;
  response: string;
  attachments: string;
  completionDate: string;
  classification: string;
  gpa: string;
  adjustmentMadeOnBehalfOf: string;
  reasonComment: string;
}

@Component({
  selector: 'app-archived-observation-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    DragDropModule,
    TranslateModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './archived-observation-details.component.html',
  styleUrls: ['./archived-observation-details.component.scss'],
})
export class ArchivedObservationDetailsComponent implements OnInit {
  id!: string;
  isRtl: boolean = false;
  obsContant: any = '';
  obsId!: string;
  workItem: any;
  loginId!: string;
  isLoading: boolean = true;
  reportCycle!: string;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'from',
    'to',
    'stepName',
    'actionTaken',
    'responseDate',
    'response',
    'attachments',
    'completionYear',
    'classification',
    'comment',
  ];

  displayedColumnsMob: string[] = ['obsTitle'];

  observationCycles = [
    {
      value: 'Initial Report',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Quarterly Report Q1',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Quarterly Report Q2',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Quarterly Report Q3',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Quarterly Report Q4',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Semi-annual Report 1',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
    {
      value: 'SAB Semi-annual Report 2',
      departments: [{ headerName: '', dataSource: new MatTableDataSource([]) }],
      isVisible: false,
    },
  ];

  observationNotes: { notes: any[] } = { notes: [] };
  isAdmin: boolean = false;
  userInformation: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private route: ActivatedRoute,
    private coreService: CoreService,
    public dialog: MatDialog,
    private _loading: LoadingService,
    private sharedVariableService: SharedVariableService
  ) {}

  ngOnInit(): void {
    this.sharedVariableService.isRtl$.subscribe((v) => (this.isRtl = v));

    this.route.params.subscribe((params) => (this.id = params['obsId']));

    const raw = localStorage.getItem('sabUserInformation');
    this.userInformation = raw ? JSON.parse(raw) : {};
    this.isAdmin = !!this.userInformation.admin;

    this.getObservationInfo();
    this.getNotes();
  }

  private getObservationInfo(): void {
    this.isLoading = true;
    const url = `respAuditController/getAuditInfo?obsId=${this.id}`;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe({
      next: (response: any) => {
        this._loading.setLoading(false, url);
        this.populateCycles(response);
        this.obsId = response.obsId;
        this.reportCycle = response.reportCycle;
        this.workItem = response;
        this.isLoading = false;
      },
      error: (err) => {
        this._loading.setLoading(false, url);
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  private populateCycles(response: any) {
    const sections = [
      'irDetails',
      'q1Details',
      'q2Details',
      'q3Details',
      'q4Details',
      'sa1Details',
      'sa2Details',
    ];
    sections.forEach((key, idx) => {
      const arr = response[key] || [];
      const cycle = this.observationCycles[idx];
      cycle.departments = [
        { headerName: '', dataSource: new MatTableDataSource([]) },
      ];
      cycle.isVisible = false;
      if (arr.length) {
        arr.forEach((sec: any, i: number) => {
          if (
            (sec.headerName !== 'NA' && sec.auditList.length) ||
            arr.length === 1
          ) {
            // ensure classification field exists
            sec.auditList.forEach((item: any) => {
              if (!item.hasOwnProperty('classification')) {
                item.classification = '';
              }
            });
            cycle.departments.push({
              headerName: sec.headerName,
              dataSource: new MatTableDataSource(sec.auditList),
            });
          }
        });
        cycle.departments.shift();
        cycle.isVisible = true;
      }
    });
  }

  viewResponse(responseId: string, type: 'text' | 'attachment') {
    const endPoint =
      type === 'text'
        ? `respAuditController/getResponse?responseId=${responseId}`
        : `respAuditController/getAttachments?responseId=${responseId}`;

    this._loading.setLoading(true, endPoint);
    this.coreService.get(endPoint).subscribe({
      next: (resp: any) => {
        this._loading.setLoading(false, endPoint);
        if (type === 'text') {
          this.dialog.open(ArchivedResponseContentComponent, {
            data: { obsContent: resp.obsResponse },
          });
        } else {
          this.dialog.open(AttachmentListComponent, {
            data: { attachment: resp },
          });
        }
      },
      error: (err) => {
        this._loading.setLoading(false, endPoint);
        console.error(err);
      },
    });
  }

  tabClick() {
    // nothing for now
  }

  private getNotes(): void {
    const url = `respAuditController/getObservationNotes?obsId=${this.id}`;
    this._loading.setLoading(true, url);
    this.coreService.get<any[]>(url).subscribe({
      next: (notes: any[]) => {
        this._loading.setLoading(false, url);
        notes.sort((a, b) =>
          a.addedDate < b.addedDate ? -1 : a.addedDate > b.addedDate ? 1 : 0
        );
        this.observationNotes = { notes };
      },
      error: (err) => {
        this._loading.setLoading(false, url);
        console.error(err);
      },
    });
  }

  showNotes(): void {
    this.dialog.open(ArchiveResponseNotesComponent, {
      data: this.observationNotes,
    });
  }
}
