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

export interface ReportData {
  obsId: string
  obsSeq: number;
  obsTitle: string;
  obsType: string;
  final: boolean;
}

export interface NewOrRepeated {
  value: string;
}

export interface FinalReport {
  value: string;
}

@Component({
  selector: 'app-initial-or-final-reports',
  templateUrl: './initial-or-final-reports.component.html',
  styleUrls: ['./initial-or-final-reports.component.scss']
})
export class InitialOrFinalReportsComponent implements OnInit {
  isRtl: any;
  years: Years[] = [];
  isLoading: boolean = false;
  selectedYear: string;
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
  selectedNewRepeatedFilter: string;
  searchReportData: any;
  dataSource: MatTableDataSource<ReportData>;
  displayedColumns: string[] = ['select', 'obsSeq', 'obsTitle', 'obsType', 'isFirst', 'isFinal'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ReportData>(true, []);
  selectedFinalReportFilter: string;
  mainUrl: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  innerWidth = 0;
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
    this.getReportYear();
    this.selectedNewRepeatedFilter = this.newOrRepeated[0].value;
    this.selectedFinalReportFilter = this.finalReport[0].value;
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
    let url = 'ReportController/getInitialAndFinalReportDetails?reportYear=' + this.selectedYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
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
    if (this.selectedNewRepeatedFilter == 'All') {
      newRepeatData = this.searchReportData.observations;
    } else if (this.selectedNewRepeatedFilter == 'جديدة') {
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
    this.checkFinalFilter(newRepeatData);
  }

  checkFinalFilter(newRepeatData: any[]) {
    let data: any[] = [];
    if (this.selectedFinalReportFilter == 'All') {
      data = newRepeatData;
    } else if (this.selectedFinalReportFilter == 'Yes') {
      newRepeatData.map((reportData: any) => {
        if (reportData.final) {
          data.push(reportData);
        }
      })
    } else {
      newRepeatData.map((reportData: any) => {
        if (!reportData.final) {
          data.push(reportData);
        }
      })
    }
    this.dataSource.data = data;
  }

  exportToWord() {
    var obsIds: any;
    this.selection.selected.map((data: any) => {
      if (obsIds != null && obsIds != 'undefined') {
        obsIds = obsIds + ',' + data.obsId;
      } else {
        obsIds = data.obsId;
      }
    })
    let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=InitialRepeatedReport&selectedYear=' + this.selectedYear + '&isFromOldSystem=' + this.searchReportData.fromOldSystem;
    window.open(this.mainUrl + url, '_parent');
  }
}
