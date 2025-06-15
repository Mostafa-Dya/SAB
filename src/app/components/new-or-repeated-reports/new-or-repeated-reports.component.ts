import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  obsFinalTitle: string;
  obsType: string;
}

export interface NewOrRepeated {
  value: string;
}

@Component({
  selector: 'app-new-or-repeated-reports',
  templateUrl: './new-or-repeated-reports.component.html',
  styleUrls: ['./new-or-repeated-reports.component.css']
})
export class NewOrRepeatedReportsComponent implements OnInit {
  isRtl: any;
  years: Years[] = [];
  isLoading: boolean = false;
  isFilterSelected:boolean = false;
  selectedYear: string;
  reportType: ReportType[] = [
    { value: 'initial', name: 'Initial' },
    { value: 'final', name: 'Commentary' }
  ];
  selectedReportType: string;
  reportTypeValue: string;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['select', 'obsSeq', 'obsTitle', 'obsType'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ReportData>(true, []);
  newOrRepeated: NewOrRepeated[] = [
    { value: "All" },
    { value: "جديدة" },
    { value: "متكررة" }
  ];
  selectedFilter: string;
  searchReportData: any;
  mainUrl: string;  
  innerWidth = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
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
      this.applyOldFilter()
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  getReports() {
    this.selection.clear()
    this.isLoading = true;
    let url = 'ReportController/getNewAndRepReportDetails?reportYear=' + this.selectedYear + '&reportType=' + this.selectedReportType;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.reportTypeValue = this.selectedReportType;
      this.searchReportData = response;
      this.dataSource = new MatTableDataSource(response.observations);
      console.log(response);
      
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }


  
  applyOldFilter(){

    let newRepeatFilter: any = localStorage.getItem('newRepeatFilter');
    if (newRepeatFilter != null) {
      this.isFilterSelected = true;
      if (newRepeatFilter == 'undefined') {
        this.selectedFilter = "";
      } else {
        this.selectedFilter = newRepeatFilter.replace(/"/g, "");
      }
    }
    let newRepeatedType: any = localStorage.getItem('newRepeatedType');
    if (newRepeatedType != null) {
       this.isFilterSelected = true;
       if (newRepeatedType == 'undefined') {
        this.selectedReportType = "";
       } else {
        this.selectedReportType = newRepeatedType.replace(/"/g, "");
       }
    }

    let newRepeatedYear: any =localStorage.getItem('newRepeatedYear');
    if (newRepeatedYear != null) {
       this.isFilterSelected = true;
       if (newRepeatedYear == 'undefined') {
        this.selectedYear = "";
       } else {
        this.selectedYear = newRepeatedYear.replace(/"/g, "");
       }
    }


    
    if( this.isFilterSelected){
      this.getReports();
    }


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

  
  navigateTo(row: any) {
    localStorage.setItem('newRepeatFilter', this.selectedFilter);
    localStorage.setItem('newRepeatedType',this.selectedReportType);
    localStorage.setItem('newRepeatedYear', this.selectedYear);

    this.router.navigate(['/reports/new-or-repeated-report/observation-detail/', row.obsId],{ queryParams: { linkType: 'report',reportYear: this.selectedYear } });
  }

  exportToWord() {   
    var obsIds:any;

    this.selection.selected.map((data: any) => {
      if(obsIds!=null && obsIds!='undefined'){
        obsIds = obsIds +','+data.obsId ;
      }else{
        obsIds =data.obsId ;
        }
     // obsIds.push(data.obsId);
    })
    let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=NewRepeatedReport&reportType=' + this.selectedReportType + '&selectedYear=' + this.selectedYear + '&isFromOldSystem=' + this.searchReportData.fromOldSystem;
    window.open(this.mainUrl + url, '_parent');
  }
}
