import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { InformationDialog } from './information-dialog/information-dialog.component';
import { SharedModule } from '../../shared/modules/shared.module';

// We reuse the interface to shape our data row
export interface ExtractFinalObservation {
  observationDiwanReply: string;
  observationDocID: string;
  observationFinalTitle: string;
  observationSequence: string;
  observationTitle: string;
  observationType: string;
  obsSequence?: number;
}

@Component({
  selector: 'app-compare-observation',
  templateUrl: './compare-observation.component.html',
  styleUrls: ['./compare-observation.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class CompareObservationComponent implements OnInit, OnDestroy {
  /** Whether layout is RTL or not */
  isRtl = false;

  /** Material table data-source */
  dataSource!: MatTableDataSource<ExtractFinalObservation>;

  /** Column definitions for LTR layout */
  displayedColumns: string[] = [
    'obsSequence',
    'observationFinalTitle',
    'observationTitle',
    'view',
  ];

  /** Column definitions for RTL layout */
  displayedColumnsRTL: string[] = [
    'view',
    'observationTitle',
    'observationFinalTitle',
    'obsSequence',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Response from the API with autoComparedObs and totalObs */
  finalObsData: any;
  status!: string;
  userInformation: any;
  reportYear = '';

  /** Destroy notifier for subscriptions */
  private readonly destroy$ = new Subject<void>();

  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to RTL changes
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => (this.isRtl = rtl));

    // Load userInformation from localStorage or the shared service
    const data = localStorage.getItem('sabUserInformation');
    if (data) {
      this.userInformation = JSON.parse(data);
      if (this.userInformation.reportYear) {
        this.reportYear = this.userInformation.reportYear;
      }
    }

    // Get the route param
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.status = params['status'];
      if (this.status === 'new') {
        this.getCompareObservation();
      } else {
        this.getCompareObservationBack();
      }
    });
  }

  /**
   * Fetch compare-observations for "new" status
   */
  getCompareObservation(): void {
    const url = `launchObservations/extractFinalObs?reportYear=${this.reportYear}`;
    this.loadingService.setLoading(true, url);

    this.coreService.get<any>(url).subscribe({
      next: (response) => {
        this.loadingService.setLoading(false, url);

        response.autoComparedObs.forEach((obs: any, index: number) => {
          obs.obsSequence = index + 1;
        });

        this.finalObsData = response;
        this.dataSource = new MatTableDataSource(response.autoComparedObs);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        // Open info dialog
        this.dialog.open(InformationDialog, {
          data: {
            autoComparedObsCount: response.autoComparedObsCount,
            totalObs: response.totalObs,
          },
          disableClose: true,
        });
      },
      error: (err) => {
        this.loadingService.setLoading(false, url);
        console.error('Error fetching observations:', err);
      },
    });
  }

  /**
   * Fetch compare-observations for "back" status
   */
  getCompareObservationBack(): void {
    const url = 'launchObservations/getIntialFinalList';
    this.loadingService.setLoading(true, url);

    this.coreService.get<any>(url).subscribe({
      next: (response) => {
        this.loadingService.setLoading(false, url);

        response.autoComparedObs.forEach((obs: any, index: number) => {
          obs.obsSequence = index + 1;
        });

        this.finalObsData = response;
        this.dataSource = new MatTableDataSource(response.autoComparedObs);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.loadingService.setLoading(false, url);
        console.error('Error fetching observations:', err);
      },
    });
  }

  /**
   * Confirm or navigate to link
   */
  confirmAll(): void {
    if (
      this.finalObsData?.totalObs === this.finalObsData?.autoComparedObsCount
    ) {
      const url = `launchObservations/updateFinalObservations?reportYear=${this.reportYear}`;
      this.loadingService.setLoading(true, url);

      this.coreService.get<any>(url).subscribe({
        next: () => {
          this.loadingService.setLoading(false, url);
          this.router.navigate([
            'extractReports',
            'compare-observations',
            'new',
            'initial-final-comparison-report',
          ]);
        },
        error: (err) => {
          this.loadingService.setLoading(false, url);
          console.error('Error confirming observations:', err);
        },
      });
    } else {
      // If not all automatically matched, go to link page
      this.router.navigate([
        'extractReports',
        'compare-observations',
        'new',
        'link-observations',
      ]);
    }
  }

  /**
   * Navigate to the final observation detail page
   */
  goToExtractFinalObs(obsId: string): void {
    this.router.navigate([
      'extractReports',
      'compare-observations',
      'new',
      'extract-final-observation',
      obsId,
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
