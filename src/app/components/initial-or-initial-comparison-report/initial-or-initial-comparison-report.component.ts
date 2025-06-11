import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { FinalReport } from '../initial-or-final-reports/initial-or-final-reports.component';


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
  year1: any;
  year2: any
}

export interface NewOrRepeated {
  value: string;
}

@Component({
  selector: 'app-initial-or-initial-comparison-report.component',
  templateUrl: './initial-or-initial-comparison-report.component.html',
  styleUrls: ['./initial-or-initial-comparison-report.component.scss']
})
export class InitialOrInitialComparisonReportComponent implements OnInit {
  isRtl: any;
  years: Years[] = [];
  isLoading: boolean = false;
  isFilterSelected: boolean = false;
  selectedYear: string;
  selectedFinalReportFilter: string;
  selectedPreviousYear: string;
  reportTypeValue: string;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['select', 'obsSeq', 'obsTitle', 'obsType', 'year1', 'icon'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ReportData>(true, []);
  newOrRepeated: NewOrRepeated[] = [
    { value: "All" },
    { value: "جديدة" },
    { value: "متكررة" }
  ];
  finalReport: FinalReport[] = [
    { value: "All" },
    { value: "Yes" },
    { value: "No" }
  ];
  selectedFilter: string;
  searchReportData: any;
  mainUrl: string;
  previousYears: any;
  innerWidth = 0;
  currentYearHeader: String;
  preYearHeader: String;
  sortDirection: 'asc' | 'desc' = 'asc';
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

    this.getReportYear();
    this.selectedFilter = this.newOrRepeated[0].value;
    this.selectedFinalReportFilter = this.finalReport[0].value;
    this.mainUrl = this.configService.baseUrl;
    this.innerWidth = window.innerWidth;
    // this.getPreviousYear();
  }

  onResize(event: any) {
    this.innerWidth = window.innerWidth;
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
      this.previousYears = this.years.slice(1);
      this.selectedPreviousYear=this.previousYears[0].value;
      //this.applyOldFilter()
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getReports() {
    this.selection.clear()
    this.isLoading = true;
    let response: any;
    this.isLoading = true;
    let url = 'ReportController/getInitialAndInitialReportDetails?currentReportYear=' + this.selectedYear + '&previousReportYear=' + this.selectedPreviousYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
        // response={"totalObsCount":2,"newObsCount":0,"repeatedObsCount":0,"matchedObsCount":2,"notMatchedObsCount":0,"observations":[{"obsId":"2022-2023-1","obsType":"REPEATED","obsTitle":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","obsSeq":"1","final":false,"match":false},{"obsId":"2022-2023-2","obsType":"REPEATED","obsTitle":" س- \tاستمرار عدم قيام الشركة بتطبيق غرامات التأخير (PTOF) البالغة 122,400,000/000 دينار كويتي على مقاولي الحزم حتى","obsSeq":"2","final":false,"match":true}],"fromOldSystem":false}
   
    this.isLoading = false;
    this._loading.setLoading(false, url);
    // this.reportTypeValue = this.selectedReportType;
    for(let i=0;i<response.observations.length;i++) {
      if(response.observations[i].match) {
        response.observations[i].icon='check'
      }else {
       response.observations[i].icon='close'
      }
    }
    this.currentYearHeader=this.selectedYear;
    this.preYearHeader=this.selectedPreviousYear;
    this.searchReportData = response;
    this.dataSource = new MatTableDataSource(response.observations);
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


  checkFinalFilter(newRepeatData: any[]) {
    let data: any[] = [];
    if (this.selectedFinalReportFilter == 'All') {
      data = newRepeatData;
    } else if (this.selectedFinalReportFilter == 'Yes') {
      console.log(this.selectedFinalReportFilter);
      
      newRepeatData.map((reportData: any) => {
        if (reportData.match) {
          data.push(reportData);
        }
      })
    } else  {
      newRepeatData.map((reportData: any) => {
        if (!reportData.match) {
          console.log('4');
          
          data.push(reportData);
        }
      })
    }
    this.dataSource.data = data;
  }

/**
  applyOldFilter() {

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
    // if (newRepeatedType != null) {
    //    this.isFilterSelected = true;
    //    if (newRepeatedType == 'undefined') {
    //     this.selectedReportType = "";
    //    } else {
    //     this.selectedReportType = newRepeatedType.replace(/"/g, "");
    //    }
    // }

    let newRepeatedYear: any = localStorage.getItem('newRepeatedYear');
    if (newRepeatedYear != null) {
      this.isFilterSelected = true;
      if (newRepeatedYear == 'undefined') {
        this.selectedYear = "";
      } else {
        this.selectedYear = newRepeatedYear.replace(/"/g, "");
      }
    }



    if (this.isFilterSelected) {
      this.getReports();
    }


  }
**/
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

  filterChange() {
    this.selection.clear()
    let newRepeatData: any[] = [];
    if (this.selectedFilter == 'All') {
      newRepeatData = this.searchReportData.observations;
    } else if (this.selectedFilter == 'جديدة') {
      this.searchReportData.observations.map((reportData: any) => {
        if (reportData.obsType == 'NEW') {
          newRepeatData.push(reportData);
        }
      })
    } else {
      this.searchReportData.observations.map((reportData: any) => {
        if (reportData.obsType == 'REPEATED') {
          newRepeatData.push(reportData);
        }
      })
    }
    // this.dataSource.data = data;
    this.checkFinalFilter(newRepeatData);
  }

/**
  navigateTo(row: any) {
    localStorage.setItem('newRepeatFilter', this.selectedFilter);
    // localStorage.setItem('newRepeatedType',this.selectedReportType);
    localStorage.setItem('newRepeatedYear', this.selectedYear);

    // this.router.navigate(['/reports/new-or-repeated-report/observation-detail/', row.obsId], { queryParams: { linkType: 'report', reportYear: this.selectedYear } });
  }
**/
  exportToWord() {
    var obsIds: any;

    this.selection.selected.map((data: any) => {
      if (obsIds != null && obsIds != 'undefined') {
        obsIds = obsIds + ',' + data.obsId;
      } else {
        obsIds = data.obsId;
      }
      // obsIds.push(data.obsId);
    })
    let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=InitialAndInitialReport&selectedYear=' + this.selectedYear + '&isFromOldSystem=' + this.searchReportData.fromOldSystem + '&prevYear=' + this.selectedPreviousYear;
    window.open(this.mainUrl + url, '_parent');
  }
}
