import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-extract-final-observation',
  templateUrl: './extract-final-observation.component.html',
  styleUrls: ['./extract-final-observation.component.css']
})
export class ExtractFinalObservationComponent implements OnInit {
  isRtl: any;
  obsId: any;
  finalObsData: any;

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.obsId = params['obsId'];
    });
    this.extractFinalObs();
  }

  extractFinalObs() {
    let url = 'launchObservations/getCompareViewDetails?obsId=' + this.obsId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.finalObsData = response;
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    })
  }

  goCompareObs() {
    let status = 'back';
    this.router.navigate(['extractReports/compare-observations', status]);
  }

  goNotMatch() {
    let url = 'launchObservations/unMatchObservation?obsId=' + this.obsId;;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      let status = 'back';
      this.router.navigate(['extractReports/compare-observations', status]);
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }
}
