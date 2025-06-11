import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
}

export interface ReportData {
  obsId: string
  obsSeq: number;
  obsTitle: string;
  obsType: string;
  obsFinalTitle: string,
  final: boolean
}

export interface NewOrRepeated {
  value: string;
}

@Component({
  selector: 'app-initial-or-final-observation-titles',
  templateUrl: './initial-or-final-observation-titles.component.html',
  styleUrls: ['./initial-or-final-observation-titles.component.css']
})
export class InitialOrFinalObservationTitlesComponent implements OnInit {
  isRtl: any;
  isLoading: boolean = false;
  years: Years[] = [];
  selectedYear: string;
  reportType: ReportType[] = [
    { value: 'initial', name: 'Initial' },
    { value: 'final', name: 'Commentary' }
  ];
  selectedReportType: string;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['select', 'obsSeq', 'obsTitle', 'obsType'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ReportData>(true, []);
  searchReportData: any;
  newOrRepeated: NewOrRepeated[] = [
    { value: "All" },
    { value: "جديدة" },
    { value: "متكررة" }
  ];
  selectedFilter: string;
  reportTypeValue: string;
  mainUrl: string;
  pageIndex: string | null;
  innerWidth = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.selectedReportType = this.reportType[0].value;
    this.getReportYear();
    this.selectedFilter = this.newOrRepeated[0].value;
    this.mainUrl = this.configService.baseUrl;
    this.innerWidth =  window.innerWidth;
  }
  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
  getReportYear() {
    this.isLoading = true;
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      this.selectedYear = this.years[0].value;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  getReports() {
    this.selection.clear()
    this.isLoading = true;
    this.reportTypeValue = this.selectedReportType;
    let url = 'ReportController/getInitialAndFinalObsTitles?reportYear=' + this.selectedYear + '&reportType=' + this.selectedReportType;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.searchReportData = response;
      this.dataSource = new MatTableDataSource(response.observations);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: ReportData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.obsSeq + 1}`;
  }

  filterChange(event: any) {
    this.selection.clear()
    let data: any[] = [];
    if (event.source.value == 'All') {
      data = this.searchReportData.observations;
    } else if (event.source.value == 'جديدة') {
      this.searchReportData.observations.map((reportData: any) => {
        if (reportData.obsType == 'NEW') {
          data.push(reportData);
        }
      })
    } else {
      this.searchReportData.observations.map((reportData: any) => {
        if (reportData.obsType == 'REPEATED') {
          data.push(reportData);
        }
      })
    }
    this.dataSource.data = data;
  }

  exportToWord() {
    var obsIds:any;

    this.selection.selected.map((data: any) => {
      if(obsIds!=null && obsIds!='undefined'){
        obsIds = obsIds +','+data.obsId ;
      }else{
        obsIds = data.obsId ;
        }
     // obsIds.push(data.obsId);
    })
    let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=InitialFinalReportTitles&reportType=' + this.selectedReportType + '&selectedYear=' + this.selectedYear + '&isFromOldSystem=' + this.searchReportData.fromOldSystem;
    window.open(this.mainUrl + url, '_parent');
  }
  onPaginateChange(event: any) {
    // this.pageIndex = event.pageIndex;
    // localStorage.setItem('sabPaginatorInboxIndex', JSON.stringify(this.pageIndex));
  }
}
