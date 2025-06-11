import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface InitialFinalData {
  observationDiwanReply: string
  observationDocID: string;
  observationFinalTitle: string;
  observationSequence: string;
  observationTitle: string;
  observationType: string;
  final: boolean;
}

@Component({
  selector: 'app-initial-final-comparison-report',
  templateUrl: './initial-final-comparison-report.component.html',
  styleUrls: ['./initial-final-comparison-report.component.css']
})
export class InitialFinalComparisonReportComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<InitialFinalData>;
  displayedColumns: string[] = ['obsSeq', 'obsTitle', 'obsType', 'isFirst', 'isFinal'];
  displayedColumnsMob: string[] = ['observationTitle'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  initialFinalReportData: any;
  totalObsCount: any = 0;
  matchedObsCount: any = 0;
  notMatchedObsCount:any = 0
  mainUrl: string;
  innerWidth = 0;
  userInformation: any;
  reportYear: any;
  loginId: any;
  userName: any;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.reportYear = this.userInformation.reportYear;
    this.loginId = this.userInformation.sabMember.loginId;
    this.userName = this.userInformation.sabMember.userName;
    this.getReports();
    this.innerWidth =  window.innerWidth;
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
  getReports() {
    let url = 'ReportController/getInitialAndFinalReportDetails?reportYear=' + this.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.totalObsCount = response.totalObsCount;

      this.matchedObsCount = response.matchedObsCount;
      this.notMatchedObsCount = response.notMatchedObsCount
      this.initialFinalReportData = response.observations;
      this.dataSource = new MatTableDataSource(response.observations);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  exportToWord() {
    var obsIds: any;
    for(let i = 0 ;i < this.initialFinalReportData.length ;i++){
      if (obsIds != null && obsIds != 'undefined') {
        obsIds = obsIds + ',' + this.initialFinalReportData[i].obsId;
      } else {
        obsIds = this.initialFinalReportData[i].obsId;
      }
      if(i == this.initialFinalReportData.length - 1){
        let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=InitialRepeatedReport&selectedYear='+this.reportYear+'&isFromOldSystem=false';
        window.open(this.mainUrl + url, '_parent');
      }
    }
    // this.initialFinalReportData.map((data: any) => {
    //   if (obsIds != null && obsIds != 'undefined') {
    //     obsIds = obsIds + ',' + data.observationDocID;
    //   } else {
    //     obsIds = data.observationDocID;
    //   }
    // })
   
  }
}
