
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  department: string;
  reportYear: string;
}

@Component({
  selector: 'app-search-observations',
  templateUrl: './search-observations.component.html',
  styleUrls: ['./search-observations.component.scss']
})
export class SearchObservationsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['select', 'obsSequence', 'obsTitle', 'obsType', 'reportYear', 'department'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ObservationData>(true, []);
  directorateData = new FormControl();
  directorateList: string[] = ['All'];
  directorateAllValues : Directorate[] = [ { id: "All", name: "All" }];
  departmentAllValues: Department[] = [ { id: "All", name: "All" }];
  isDirectorateFirst: any = false;

  departmentData = new FormControl();
  departmentList: string[] = ['All'];
  isDepartmentFirst: any = false;
  @ViewChild(MatSort) sort: MatSort;

  years: Years[] = [];
  classifications: Classification[] = [
    { value: "", name: "الكل" },
    { value: "NEW", name: "جديدة" },
    { value: "REPEATED", name: "متكررة" }
  ];

  
  selectedYear: string;
  obsTitle: string ='';
  obsContent: string ='';
  isLoading: boolean;
  selectedClassification: string;
  selectedDirectorate: string;
  selectedDepartment: string;
  userInformation: any;
  userJobTitle: any;
  isAdmin: any;
  isFilterSelected: boolean = false;
  selectedDelegateUserInfo: any;
  isDirectorateVisible: boolean = true;
  isDepartmentVisible: boolean = true;
  mainUrl: string;
  innerWidth = 0;
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
      if (this.userJobTitle != 'SEC') {
      } else {
        let supervisorJobTitle = this.userInformation.supervisorDetails.userJobTitle;
        if (supervisorJobTitle == 'TL' || supervisorJobTitle == 'MGR' || supervisorJobTitle == 'DCEO' || supervisorJobTitle == 'CEO' ) {
          this.isDirectorateVisible = false;
          if (supervisorJobTitle != 'DCEO' && supervisorJobTitle != 'CEO') {
            this.isDepartmentVisible = false;
          }
        }
      }
      this.getYear();
    }
    // let filterClassification: any = localStorage.getItem('sabSearchObsClassification');
    // if (filterClassification != null) {
    //   this.isFilterSelected = true;
    //   this.selectedClassification = filterClassification.replace(/"/g, "");
    // } else {
      this.selectedClassification = this.classifications[0].value;
    // }
    this.innerWidth = window.innerWidth;
    // this.dataSource = new MatTableDataSource(this.observationData);
  
  }
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  applyOldFilter(){

    this.isDirectorateFirst = true;
    this.isDepartmentFirst = true;

    let filterTitle: any = localStorage.getItem('sabSearchObsTitle');
    if (filterTitle != null) {
      this.isFilterSelected = true;
      if (filterTitle == 'undefined') {
        this.obsTitle = "";
      } else {
        this.obsTitle = filterTitle.replace(/"/g, "");
      }
    }
    let filterContent: any =localStorage.getItem('sabSearchObsContent');
    if (filterContent != null) {
       this.isFilterSelected = true;
       if (filterContent == 'undefined') {
        this.obsContent = "";
       } else {
        this.obsContent = filterContent.replace(/"/g, "");
       }
    }

    let selectedClassification: any =localStorage.getItem('sabSearchObsClassification');
    if (selectedClassification != null) {
       this.isFilterSelected = true;
       if (selectedClassification == 'undefined') {
        // this.selectedClassification = "";
        this.selectedClassification = this.classifications[0].value
       } else {
        this.selectedClassification = selectedClassification.replace(/"/g, "");
       }
    }else{
      this.selectedClassification = this.classifications[0].value
    }


    let sabSearchObsFilterYear: any =localStorage.getItem('sabSearchObsFilterYear');
    if (sabSearchObsFilterYear != null) {
       this.isFilterSelected = true;
       if (sabSearchObsFilterYear == 'undefined') {
        this.selectedYear = "";
       } else {
        this.selectedYear = sabSearchObsFilterYear.replace(/"/g, "");
       }
    }


    let sabSearchObsFilterDirectorate: any = localStorage.getItem('sabSearchObsFilterDirectorate');

    if (sabSearchObsFilterDirectorate && JSON.parse(sabSearchObsFilterDirectorate).length > 0 ) {
       this.isFilterSelected = true;
       if (sabSearchObsFilterDirectorate == 'undefined') {
        this.directorateData.setValue([]);
       } else {
        sabSearchObsFilterDirectorate = JSON.parse(sabSearchObsFilterDirectorate)
      
        this.directorateData.setValue(sabSearchObsFilterDirectorate);
       }
    }else{
      localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify([]));
    }

    let sabSearchObsFilterDepartment: any =localStorage.getItem('sabSearchObsFilterDepartment');
    if (sabSearchObsFilterDepartment && JSON.parse(sabSearchObsFilterDepartment).length > 0) {
       this.isFilterSelected = true;    
        sabSearchObsFilterDepartment = JSON.parse(sabSearchObsFilterDepartment)
        console.log(sabSearchObsFilterDepartment)
        this.departmentData.setValue(sabSearchObsFilterDepartment);
    }else{
      localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify([]));
    }

    
    if( this.isFilterSelected){
      this.getObsData();
    }

    setTimeout(() => {
      this.isDirectorateFirst = false;
    this.isDepartmentFirst = false;
    }, 1000);
  }
  getUserInfo() {
    let url = 'UserController/getDelegateUserInfo?userId=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.userInformation = response;
      this.userJobTitle = response.sabMember.userJobTitle;
      this.isAdmin = response.admin;
      if (this.userJobTitle != 'SEC') {
      
      } else {
        let supervisorJobTitle = response.supervisorDetails.userJobTitle;
        if (supervisorJobTitle == 'TL' || supervisorJobTitle == 'MGR' || supervisorJobTitle == 'DCEO' || supervisorJobTitle == 'CEO') {
          this.isDirectorateVisible = false;
          if (supervisorJobTitle != 'DCEO' && supervisorJobTitle != 'CEO') {
            this.isDepartmentVisible = false;
          }
        }
      }
      this.getYear();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error : ', error);
    });
  }

  getYear() {
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      let years: any[] = [];
      response.map((data: any) => {
        years.push({ value: data })
      })
      years.reverse();
      this.years = [...this.years, ...years]
      let filterYear: any = localStorage.getItem('sabSearchObsFilterYear');
      if (filterYear != null) {
        this.selectedYear = filterYear.replace(/"/g, "");
      } else {
        this.selectedYear = this.years[0].value;
      }
      this.getDirectorateData();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getDirectorateData() {
    let url = 'UserController/getsabDirectorates';
    this._loading.setLoading(true, url);
    this.directorateAllValues = [ { id: "All", name: "All" }];
    this.directorateList = ['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        this.directorateAllValues.push({ id: key, name: response[key] })
        this.directorateList.push(response[key]);
      })
      this.directorateAllValues.sort((a:any, b:any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.directorateList.sort();
  
      this.getDepartmentData();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getDepartmentData() {
    let url = 'UserController/getsabDepartments';

    if((!this.isAdmin && !(this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG')) && this.isDepartmentVisible){
      url = url + '?directorateId=' + this.userInformation.sabMember.directorateCode
    }
    
    this._loading.setLoading(true, url);
    this.departmentAllValues = [ { id: "All", name: "All" }];
    this.departmentList =['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        this.departmentAllValues.push({ id: key, name: response[key] })
          this.departmentList.push(response[key])
      })
      this.departmentAllValues.sort((a:any, b:any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      this.departmentList.sort();     
        this.applyOldFilter();    
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });

  }

  getObsData() {
    let departmentData: string = '';
    let directorateData: string = '';
    let departmentName: string = '';
    let directorateName: string = '';
    let obsData:any[] = [];
    

    if((this.isAdmin || !(this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG')) && this.isDepartmentVisible){

      for(let i = 0 ; i< this.departmentAllValues.length ;i++){
        if(this.departmentData && this.departmentData.value && this.departmentData.value.length){
          for(let j = 0 ;j< this.departmentData.value.length  ;j++){
            if(this.departmentData.value[j] == this.departmentAllValues[i].name){
              if(departmentData == ''){
                departmentData = this.departmentAllValues[i].id;
                departmentName = this.departmentAllValues[i].name;
              }else{
                departmentData = departmentData +"," +   this.departmentAllValues[i].id;
                departmentName = departmentName +"," +   this.departmentAllValues[i].name;
                
              }
            }
        }
        }
      }
    }
    
  
    if((this.isAdmin || !(this.userJobTitle == 'DCEO'  || this.userJobTitle == 'CEO'|| this.userJobTitle == 'MGR' || this.userJobTitle == 'TL' || this.userJobTitle == 'SENG' || this.userJobTitle == 'ENG')) && this.isDirectorateVisible ){
      for(let i = 0 ; i< this.directorateAllValues.length ;i++){
        if(this.directorateData && this.directorateData.value && this.directorateData.value.length){
          for(let j = 0 ;j< this.directorateData.value.length  ;j++){
              if(this.directorateData.value[j] == this.directorateAllValues[i].name){
                if(directorateData == ''){
                  directorateData = this.directorateAllValues[i].id;
                  directorateName = this.directorateAllValues[i].name;
                }else{
                  directorateData = directorateData +"," +   this.directorateAllValues[i].id;
                  directorateName = directorateName +"," +   this.directorateAllValues[i].name;
                }
              }
          }
        }
      }
    }
    
    if(this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length ){
      departmentData = 'All';
      departmentName = 'All';
    }
    if(this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length ){
      directorateData = 'All';
      directorateName = 'All';
    }
console.log();
    this.selection.clear()
    let url = 'launchObservations/searchObservations?obsTitle=' + this.obsTitle + '&obsContent=' + this.obsContent + '&loginId=' + this.userInformation.sabMember.loginId + '&reportYear=' + this.selectedYear + '&classification=' + this.selectedClassification;
    url = url + '&directorateName=' + directorateName +'&departmentName=' + departmentName + '&directorateCode=' + directorateData + '&departmentCode=' + departmentData + '&isAdmin=' + this.isAdmin;
    
    console.log('this.userInformation  ::',this.userInformation);
    if (this.selectedDelegateUserInfo) {
      url = url +'&onBehalfOfUserTitle=' + this.userInformation.sabMember.userJobTitle+'&userDepartmentCode=' + this.userInformation.sabMember.departmentCode + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url +'&onBehalfOfUserTitle=' + this.userInformation.supervisorDetails.userJobTitle+'&userDepartmentCode=' + this.userInformation.supervisorDetails.departmentCode + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url = url +'&onBehalfOfUserTitle=' + this.userJobTitle+'&userDepartmentCode=' + this.userInformation.sabMember.departmentCode + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId;
      }
    }

    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        obsData.push(response[key]);
      })
      this.dataSource = new MatTableDataSource(obsData);
      // this.dataSource = new MatTableDataSource(response);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
      })
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
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

  checkboxLabel(row?: ObservationData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.obsSequence + 1}`;
  }

  navigateTo(row: any) {
    localStorage.setItem('sabSearchObsTitle', this.obsTitle);
    localStorage.setItem('sabSearchObsContent',this.obsContent);
    localStorage.setItem('sabSearchObsClassification', this.selectedClassification);
    localStorage.setItem('sabSearchObsFilterYear', this.selectedYear);
    localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify(this.directorateData.value? this.directorateData.value:[]));
    localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify(this.departmentData.value ? this.departmentData.value : []));
   
    this.router.navigate(['search-observations/observation-details', row.obsId],{ queryParams: { reportYear: this.selectedYear}});
  }

  onExport() {  
    var obsIds: any;
    this.selection.selected.map((data: any) => {
      if (obsIds != null && obsIds != 'undefined') {
        obsIds = obsIds + ',' + data.obsId;
      } else {
        obsIds = data.obsId;
      }
    })
    let year = '';
    if (this.selectedYear != 'All') {
      let year = this.selectedYear;
    }
    let url = 'ReportController/exportReports?ids=' + obsIds + '&reportName=SearchResults&selectedYear=' + this.selectedYear + '&isFromOldSystem=false';
    window.open(this.mainUrl + url, '_parent');
  }

  directorateChange(event: any) {

   
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {       
              this.directorateData.setValue(this.directorateList)
              localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify([]));
        } else {
              this.directorateData.setValue([]);
              localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabSearchObsFilterDirectorate');
        if (!event.source._selected) {
          setTimeout(() => {
            this.isDirectorateFirst = true;
            if (this.directorateData.value[0] == 'All') {
              let data = [...this.directorateData.value];
              data.splice(0, 1);
              this.directorateData.setValue(data);
            }
            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify(['All', event.source.value]));
            }
            this.isDirectorateFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isDirectorateFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify(filter));
              if ((this.directorateData.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorateData.setValue(this.directorateList);
                localStorage.setItem('sabSearchObsFilterDirectorate', JSON.stringify([]));
                this.isDirectorateFirst = false;
              }
              this.isDirectorateFirst = false;
            }, 300)
          }
          // this.isDirectorateFirst = false;
        }
      }
    }
    console.log(this.directorateData)
    
  }

  reset() {
    this.obsTitle = '';
    this.obsContent = '';
    this.selectedYear = this.years[0].value;
    this.selectedClassification = this.classifications[0].value;
    this.isFilterSelected = false;
    this.departmentData.setValue([]);
    this.directorateData.setValue([])
    localStorage.setItem('sabSearchObsFilterDirectorate',JSON.stringify([]));
    localStorage.setItem('sabSearchObsFilterDepartment',JSON.stringify([]));
    localStorage.removeItem('sabSearchObsTitle');
    localStorage.removeItem('sabSearchObsContent');
    localStorage.removeItem('sabSearchObsClassification');
    localStorage.removeItem('sabSearchObsFilterYear');
    this.selection.clear()   
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data = [];
    }
    

  }

  departmentChange(event: any) {
   
    if (!this.isDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isDepartmentFirst = true;
        if (event.source._selected) {
          this.departmentData.setValue(this.departmentList)
          localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify([]));
        } else {        
          this.departmentData.setValue([]);
          localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabSearchObsFilterDepartment');

        if (!event.source._selected) {
          setTimeout(() => {
            this.isDepartmentFirst = true;

            if (this.departmentData.value[0] == 'All') {
              let data = [...this.departmentData.value];
              data.splice(0, 1);
              this.departmentData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify(['All', event.source.value]));
            }
            this.isDepartmentFirst = false;
          }, 300)
        } else {
          if (filter) {
            setTimeout(() => {
              this.isDepartmentFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1)
              localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify(filter));
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabSearchObsFilterDepartment', JSON.stringify([]));
                this.isDepartmentFirst = false;
              }
              this.isDepartmentFirst = false;
            }, 300)
          }
          
        }

      }

    }
  }


}
