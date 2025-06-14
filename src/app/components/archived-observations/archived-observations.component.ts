import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ExportComponent } from '../export/export.component';

export interface Years {
  value: string;
}

export interface Classification {
  value: string;
  name: string;
}

export interface Cycle {
  value: string;
  name: string;
}

export interface Directorate {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface ObservationData {
  obsTitle: string;
  obsSequence: number;
  cycle: string;
  reportYear: string;
}

@Component({
  selector: 'app-archived-observations',
  templateUrl: './archived-observations.component.html',
  styleUrls: ['./archived-observations.component.css']
})
export class ArchivedObservationsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<ObservationData>;
  displayedColumns: string[] = ['obsSequence', 'obsTitle', 'reportYear'];
  displayedColumnsMob: string[] = ['obsTitle'];
  selection = new SelectionModel<ObservationData>(true, []);
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  years: Years[] = [
    // { value: 'All' }
  ];
  cycleValue: Cycle[] = [
    { value: "All", name: "All" },
    { value: 'SAB Initial Report', name: 'التقرير الأولى لديوان المحاسبةInitial Rpt' },
    { value: 'SAB Commentary Report', name: "تقرير تعقيب الديوان SAB Commentary Report"},
    { value: 'KNPC Response Report', name: 'الرد على التقرير الأولى لديوان المحاسبة KNPC Response Rpt' },
    { value: 'SAB Quarterly Report Q1', name: 'التقرير الربع سنوى الأول  Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'التقرير الربع سنوى الثاني Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'التقرير الربع سنوى الثالت Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'التقرير الربع سنوى الرابع Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'التقرير النصف سنوى الأول SA1' },
    { value: 'SAB Semi-annual Report 2', name: 'التقرير النصف سنوى الثاني SA2' },
    { value: 'Final Report Launch', name: 'ا التقرير النهائي KNPC Final Report' },
    { value: 'SAB Statistics', name: 'SAB Statistics' },
    { value: 'AnnalReport', name: 'التقرير السنوي' },
    { value: 'SeriouslySettleNotes', name: 'جدية تسوية الملاحظات' }
  ];
  directorateValue: Directorate[] = [
    { id: "0", name: "All" }
  ];
  departmentValue: Department[] = [
    { id: "0", name: "All" }
  ];
  selectedYear: string;
  selectedCycle: string;
  obsTitle: string;
  isLoading: boolean;
  userInformation: any;
  userJobTitle: any;
  isAdmin: any;
  isFilterSelected: boolean;
  selectedDelegateUserInfo: any;
  mainUrl: string;
  reportYear: any;
  loginId:string;
  obsSequence: string = '';

  constructor(
    private coreService: CoreService,
    private router: Router,
    public dialog: MatDialog,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.mainUrl = this.configService.baseUrl;
    let filterTitle: any = localStorage.getItem('sabArchivedObsTitle');
    if (filterTitle != null) {
      this.isFilterSelected = true;
      if (filterTitle == 'undefined') {
        this.obsTitle = "";
      } else {
        this.obsTitle = filterTitle.replace(/"/g, "");
      }
    }
    let delegateuser: any = localStorage.getItem('sabDelegateUser');
    if (delegateuser) {
      this.selectedDelegateUserInfo = JSON.parse(delegateuser);
    }
    if (this.selectedDelegateUserInfo) {
      this.getUserInfo();
    } else {
      let data: any = localStorage.getItem('sabUserInformation');
      this.userInformation = JSON.parse(data);
      this.userJobTitle = this.userInformation.sabMember.userJobTitle;
      this.isAdmin = this.userInformation.admin;
      this.reportYear = this.userInformation.reportYear;
      this.loginId = this.userInformation.sabMember.loginId;
      this.getYear();
    }

    let filterClassification: any = localStorage.getItem('sabArchivedObsFilterObsSequence');
    if (filterClassification != null) {
      this.isFilterSelected = true;
      this.obsSequence = filterClassification.replace(/"/g, "");
    } else {
      this.obsSequence = '';
    }
  }

  getUserInfo() {
    let url = 'UserController/getDelegateUserInfo?userId=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.userInformation = response;
      this.userJobTitle = response.sabMember.userJobTitle;
      this.isAdmin = response.admin;
      this.reportYear = response.reportYear;
      if (this.userJobTitle != 'SEC') {
        this.directorateValue[0].id = response.sabMember.directorateCode;
      } else {
        this.directorateValue[0].id = response.supervisorDetails.directorateCode;
        let supervisorJobTitle = response.supervisorDetails.userJobTitle;
      }
      this.getYear();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error : ', error);
    });
  }

  getYear() {
    let url = 'uploadReportController/getMigratedReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.map((data: any, index: any) => {        
        this.years.push({ value: data });
        if (this.reportYear == data) {
          this.selectedYear = data;
        }
      });
      this.years.reverse();
      let filterYear: any = localStorage.getItem('sabArchivedObsFilterYear');
      if (filterYear != null) {
        this.isFilterSelected = true;
        this.selectedYear = filterYear.replace(/"/g, "");
        } else {
          this.selectedYear = this.years[0].value;

      }

      if (this.isFilterSelected) {
        this.getObsData();
      }
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  getObsData() {
    let obsData: any[] = [];
    this.selection.clear()
    let url = 'launchObservations/archivedObservations?obsTitle=' + this.obsTitle + '&loginId=' + this.loginId + '&reportYear=' + this.selectedYear + '&obsSeq=' + (this.obsSequence ? this.obsSequence : '');
    url = url + '&isAdmin=' + this.isAdmin;
    if (this.selectedDelegateUserInfo) {
      url = url +'&onBehalfOfUserTitle=' + this.userInformation.sabMember.userJobTitle+'&userDepartmentCode=' + this.userInformation.sabMember.departmentCode+ '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url +'&onBehalfOfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle+'&userDepartmentCode=' + this.userInformation.supervisorDetails.departmentCode+ '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url = url +'&onBehalfOfUserTitle=' + this.userJobTitle+'&userDepartmentCode=' + this.userInformation.sabMember.departmentCode+ '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId;
      }
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      // response = {"2021-2022-1":{"obsId":"2021-2022-1","obsTitle":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","obsSequence":1,"reportYear":"2021-2022","department":"Corporate Planning","obsType":"REPEATED"},"2021-2022-2":{"obsId":"2021-2022-2","obsTitle":"    س- \tاستمرار عدم قيام الشركة بتطبيق غرامات التأخير (PTOF) البالغة 122,400,000/000 دينار كويتي على مقاولي الحزم حتى","obsSequence":2,"reportYear":"2021-2022","department":"Chief Executive Officer's Office","obsType":"REPEATED"},"2021-2022-3":{"obsId":"2021-2022-3","obsTitle":"   2- \tالملاحظات الخاصة بالعقد رقم (CFP/MISC/0064):","obsSequence":3,"reportYear":"2021-2022","department":"Corporate Planning","obsType":"NEW"},"2021-2022-4":{"obsId":"2021-2022-4","obsTitle":"  3- \tالملاحظات الخاصة بمطالبات المقاولين:","obsSequence":4,"reportYear":"2021-2022","department":"Committee","obsType":"REPEATED"}}
      Object.keys(response).forEach((key) => {
        obsData.push(response[key]);
      })
      this.dataSource = new MatTableDataSource(obsData);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  navigateTo(row: any) {
    localStorage.setItem('sabArchivedObsTitle', JSON.stringify(this.obsTitle));
    localStorage.setItem('sabArchivedObsFilterYear', JSON.stringify(this.selectedYear));
    localStorage.setItem('sabArchivedObsFilterObsSequence', JSON.stringify(this.obsSequence));
    this.router.navigate(['archived-observations/observation-details', row.obsId]);
  }

  reset() {
    this.obsTitle = '';
    this.selectedYear = this.years[0].value;
    this.obsSequence = '';
    // this.selectedCycle = this.cycleValue[0].value;
    // this.selection.clear()
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data = [];
    }
  }
}