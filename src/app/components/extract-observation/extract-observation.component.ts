import { Component, OnInit } from '@angular/core';
import { ExtractionReport } from 'src/app/models/extractionReport.model';
import { ObservationCard } from 'src/app/models/observationCard.model';
import { MatDialog } from '@angular/material/dialog';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { Router } from '@angular/router';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-extract-observation',
  templateUrl: './extract-observation.component.html',
  styleUrls: ['./extract-observation.component.css']
})
export class ExtractObservationComponent implements OnInit {
  exractionReport: ExtractionReport;
  observationList: ObservationCard[];
  isActive = false;
  obsType: string = '';
  obsTitle: string = '';
  obsContent: string = '';
  selectedObservation: any;
  isLoading: boolean = true;
  reportToBeGenerated: string = '';
  loginId: string;
  isRtl: any;
  sabResponse: string = '';
  diwanReply: string = '';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private coreService: CoreService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.loginId = localStorage.getItem('loginId') || '';
    // this.getUserInfo();
    this.getExtractObservation();
  }

  getUserInfo() {
    let url = 'UserController/getUserInfo?userId=' + this.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this.coreService.get(url).subscribe((response: any) => {
      this.sharedVariableService.setReportYearValue(response.reportYear);
      localStorage.setItem('sabUserInformation', JSON.stringify(response: any));
    }, error => {
      console.log('error  :', error);
    })
  }

  getExtractObservation() {
    let url = "launchObservations/getExtractionList";
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.exractionReport = response;
      if (response.firstObsTitle) {
        if (response.observations) {
          this.observationList = response.observations;
          this.selectedObservation = this.observationList[0];
        }
        this.obsType = response.firstObsType
        this.obsTitle = response.firstObsTitle;
        this.obsContent = response.firstObsContent;
        this.selectedObservation.obsContent = response.firstObsContent;
        this.reportToBeGenerated = response.reportToBeGenerated;
        if (this.reportToBeGenerated == 'SAB Quarterly Report Q1') {
          this.sabResponse = response.firstSabResponse;
          this.diwanReply = response.firstDiwanReply;
        }
      }else if(response.isComparisionPending){
      //  if (this.reportToBeGenerated == 'SAB Quarterly Report Q1') {
        if (true) {
          let status = 'new';
          this.router.navigate(['extractReports/compare-observations', status]);
        }
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  onSelectObs(observationCard: ObservationCard) {
    // this.isLoading = true;
    let url = 'launchObservations/getObservationContent?obsId=' + observationCard.obsId + "&reportToBeGenerated=" + this.reportToBeGenerated;
    // this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // this.isLoading = false;
      // this._loading.setLoading(false, url);
      this.selectedObservation = response;
      this.obsContent = response.obsContent;
      this.obsType = observationCard.obsType;
      this.obsTitle = observationCard.obsTitle;
      if (this.reportToBeGenerated == 'SAB Quarterly Report Q1') {
        this.sabResponse = response.sabResponse;
        this.diwanReply = response.diwanReply;
      }
    }, error => {
      // this.isLoading = false;
      // this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  changeObservationType() {
    if (this.obsType == "NEW") {
      this.obsType = "REPEATED"
    } else {
      this.obsType = "NEW"
    }
  }

  updateObservation() {
    this.isLoading = true;
    this.selectedObservation.obsTitle = this.obsTitle;
    this.selectedObservation.obsType = this.obsType;
    let url = 'launchObservations/adjustObservation';
    this._loading.setLoading(true, url);
    this.coreService.post(url, this.selectedObservation).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.getExtractObservation();
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  onExapnd() {
    if (this.reportToBeGenerated == 'SAB Quarterly Report Q1') {
      this.selectedObservation.obsContent = this.selectedObservation.obsContent + '<span>' + this.sabResponse + '</span>' + '<span>' + this.diwanReply + '</span>';
    } else {
      this.selectedObservation = this.selectedObservation;
    }
    const dialogRef = this.dialog.open(ExpandContentComponent, {
      data: this.selectedObservation
    });
  }

  onExtractAll() {
    if (this.reportToBeGenerated == 'SAB Quarterly Report Q1') {
      let status = 'new';
      this.router.navigate(['extractReports/compare-observations', status]);
    } else {
      this.isLoading = true;
      let url = 'launchObservations/extractAll?userId=' + this.loginId + "&reportToBeGenerated=" + this.reportToBeGenerated;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        this.clearFilter();
        this.router.navigate(['/inbox']);
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error  :', error);
      });
    }
  }

  onDiscardAll() {
    this.isLoading = true;
    let url = 'launchObservations/discardLaunchedObs?userId=' + this.loginId + "&reportCycle=234234";
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['/launchReports']);
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }

  clearFilter() {
    localStorage.removeItem('sabFilterType');
    localStorage.removeItem('sabFilterSequence');
    localStorage.removeItem('sabFilterDepartment');
    localStorage.removeItem('sabFilterStatus');
    localStorage.removeItem('sabSentItemsFilterType');
    localStorage.removeItem('sabSentItemsFilterSequence');
    localStorage.removeItem('sabSentItemsFilterDepartment');
    localStorage.removeItem('sabSentItemsFilterStatus');
    localStorage.removeItem('sabSentItemsFilterDirectorate');
    localStorage.removeItem('sabSentItemsFilterBehalf');
    localStorage.removeItem('sabSentItemsFilterMultipleDept');
    localStorage.removeItem('sabResponseProgressFilterType');
    localStorage.removeItem('sabResponseProgressFilterSequence');
    localStorage.removeItem('sabResponseProgressFilterDepartment');
    localStorage.removeItem('sabResponseProgressFilterStatus');
    localStorage.removeItem('sabResponseProgressFilterDirectorate');
    localStorage.removeItem('sabResponseProgressFilterBehalf');
    localStorage.removeItem('sabResponseProgressFilterMultipleDept');
  }
}