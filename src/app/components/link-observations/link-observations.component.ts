import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
@Component({
  selector: 'app-link-observations',
  templateUrl: './link-observations.component.html',
  styleUrls: ['./link-observations.component.scss']
})
export class LinkObservationsComponent implements OnInit {
  obsTitle: string = '';
  oldObs: any[];
  currentIndex: number;
  isRtl: any;
  isLoading: boolean = true;
  pandingObservationLink: any;
  userInformation: any;
  reportYear:string;
  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    let data: any = localStorage.getItem('sabUserInformation');

    this.userInformation = JSON.parse(data);

    this.reportYear = this.userInformation.reportYear;
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.getPandingObservationLink();
  }

  getPandingObservationLink() {
    this.isLoading = true;
    let url = 'launchObservations/getPendingObservationToLink';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      if (response.observationsPending > 0) {
        this.pandingObservationLink = response;
        this.onSearch();
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onSearch(): void {
    this.isLoading = true;
    let url = 'launchObservations/getObsContentByTitle?obsTitle=' + this.obsTitle + '&reportYear=' + this.pandingObservationLink.finalObs.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.oldObs = response;
      this.currentIndex = 0;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  onPrevious(): void {
    this.currentIndex = this.currentIndex - 1;
  }

  onFinish(): void {
    this.isLoading = true;
    let url = 'launchObservations/updateFinalObservations?reportYear='+this.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.router.navigate(['extractReports/compare-observations/new/initial-final-comparison-report']);
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  onNext(): void {
    this.currentIndex = this.currentIndex + 1;
  }

  onConfirm(): void {
    this.isLoading = true;
    let linkObs = {
      finalObs: this.pandingObservationLink.finalObs,
      initialObs: this.oldObs[this.currentIndex]
    }
    let url = 'launchObservations/linkObservations';
    this._loading.setLoading(true, url);
    this.coreService.post(url, linkObs).subscribe((response: any) => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      if (response.observationsPending > 0) {
        this.pandingObservationLink = response;
        this.onSearch();
      } else {
        this.pandingObservationLink = '';
      }
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }
}
