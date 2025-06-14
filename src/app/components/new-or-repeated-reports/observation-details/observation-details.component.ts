// import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild ,ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ExpandContentComponent } from '../../expand-content/expand-content.component';

@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.component.html',
  styleUrls: ['./observation-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ObservationDetailsComponent implements OnInit {
  id: string;
  isRtl: any;
  obsContant: any = "";
  obsId: string;
  workItem: any;
  loginId: string;
  isLoading: boolean = true;
  reportCycle: string;
  linkType:string= '';
  reportYear:string;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private route: ActivatedRoute,
    private coreService: CoreService,
    public dialog: MatDialog,
    private _loading: LoadingService,
    private sharedVariableService: SharedVariableService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.id = params['obsId'];      
    });
    this.route.queryParams.subscribe(params => {
      this.linkType = params['linkType'];
  });
  this.route.queryParams.subscribe(params => {
    this.reportYear = params['reportYear'];
});
    this.getObservationInfo();
  }
  getObservationInfo() {
    this.isLoading = true;
    
    let url = 'launchObservations/searchObservationById?obsId=' + this.id + "&reportYear="+this.reportYear+ "&r=" + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.reportCycle = response.reportCycle;
      this.workItem = response;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }
  
  onExapnd(data: any) {
    let observation = {
      obsContent: data
    }
    const dialogRef = this.dialog.open(ExpandContentComponent, {
      data: observation
    });
  }
  tabClick() {
    this.accordion.closeAll();
  }
}
