import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface ExtractFinalObservation {
  observationDiwanReply: string;
  observationDocID: string;
  observationFinalTitle: string;
  observationSequence: string;
  observationTitle: string
  observationType: string;
}

@Component({
  selector: 'app-compare-observation',
  templateUrl: './compare-observation.component.html',
  styleUrls: ['./compare-observation.component.css']
})
export class CompareObservationComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<ExtractFinalObservation>;
  displayedColumns: string[] = ['obsSequence', 'observationFinalTitle', 'observationTitle', 'view'];
  displayedColumnsRTL: string[] = ['view', 'observationTitle', 'observationFinalTitle', 'obsSequence'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  finalObsData: any;
  status: any;
  userInformation: any;
  reportYear:string;

  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let data: any = localStorage.getItem('sabUserInformation');

    this.userInformation = JSON.parse(data);

    this.reportYear = this.userInformation.reportYear;
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.status = params['status'];
    });
    if (this.status == 'new') {
      this.getCompareObservation();
    } else {
      this.getCompareObservationBack();
    }
  }

  getCompareObservation() {
    let url = 'launchObservations/extractFinalObs?reportYear='+this.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.autoComparedObs.map((data: any, index: any) => {
        data.obsSequence = index + 1;
      });
      this.finalObsData = response;
      this.dataSource = new MatTableDataSource(response.autoComparedObs);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
      this.dialog.open(InformationDialog, {
        data: {
          autoComparedObsCount: response.autoComparedObsCount,
          totalObs: response.totalObs
        }
      });
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  getCompareObservationBack() {
    let url = 'launchObservations/getIntialFinalList';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.autoComparedObs.map((data: any, index: any) => {
        data.obsSequence = index + 1;
      });
      this.finalObsData = response;
      this.dataSource = new MatTableDataSource(response.autoComparedObs);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  confirmAll() {
    if (this.finalObsData.totalObs == this.finalObsData.autoComparedObsCount) {
      let url = 'launchObservations/updateFinalObservations?reportYear='+this.reportYear;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        this.router.navigate(['extractReports/compare-observations/new/initial-final-comparison-report']);
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });
    } else {
      this.router.navigate(['extractReports/compare-observations/new/link-observations']);
    }
  }

  goToExtractFinalObs(obsId: any) {
    this.router.navigate(['extractReports/compare-observations/new/extract-final-observation', obsId]);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './information-dialog.html',
  styleUrls: ['./compare-observation.component.css']
})
export class InformationDialog {
  isRtl: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
