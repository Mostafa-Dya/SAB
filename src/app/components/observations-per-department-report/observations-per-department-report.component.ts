import { P } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Directorate {
  id: any;
  name: string;
}

export interface ReportDataTable {
  department: string,
  directorate: string,
  total: number,
}

// let ELEMENT_DATA: ReportDataTable[] = [   
//   {directorate: 'Deputy C.E.O For Plaining & Finance',department:'Corporate Planning', total: 5,  },
//   {directorate: 'Deputy C.E.O For Plaining & Finance',department:'Manufacturing Optimization Group', total: 8,  },
//   {directorate: 'Deputy C.E.O For Plaining & Finance',department:'Finance', total: 3,  },

//   {directorate: 'Deputy C.E.O For Admin & Commercial',department:'Human Resources', total: 5,  },
//   {directorate: 'Deputy C.E.O For Admin & Commercial',department:'Commercial', total: 4,  },

//   {directorate: "Chief Executive Officer's Office" ,department:'Corporate Legal', total: 2,  },
//   {directorate: "Chief Executive Officer's Office" ,department:"Chief Executive Officer's Office (Special Nature)", total: 2,  },  

//   {directorate: "N/A" ,department:'Committee', total: 2,  },
//   {directorate: 'N/A',department:"N/A", total: 3,  },  
// ];

@Component({
  selector: 'app-observations-per-department-report',
  templateUrl: './observations-per-department-report.component.html',
  styleUrls: ['./observations-per-department-report.component.scss']
})

export class ObservationsPerDepartmentReportComponent implements OnInit {
  data: any[] = [];
  dataSource: MatTableDataSource<any>;
  // public dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['department', 'total'];
  groupByColumns: string[] = ['directorate'];
  isRtl: any;
  _alldata: any[];
  isLoading: boolean = false;
  length: number = 0;
  totalObservations = 0;
  // Filters
  selectedYear: string;
  selectedReport: string = 'KNPC Response Report';
  searchedYear: string;
  searchedReport: string;
  searchedReportName: string;
  selectedDepartment: string= "All";
  selectedDirectorate: string;
  mainUrl: string;
  form: FormGroup;
  isFilterSelected: boolean;
  directorate: any = new FormControl();
  departmentData: any = new FormControl();
  directorateList: string[] = ['All'];
  directorateAllValues: Directorate[] = [{ id: "All", name: "All" }];
  isDirectorateFirst: any = false;
  isAdmin: any;
  userInformation: any;
  departmentList: string[] = ['All'];
  departmentAllValues: Department[] = [{ id: "All", name: "All" }];
  isDepartmentFirst: any = false;
  years: Years[] = [];

  reportType: ReportType[] = [
    { value: 'KNPC Response Report', name: 'KNPC_RESPONSE_REPORT' },
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' }
  ];
  // department: Department[] = [
  //   { id: "0", name: "All" }
  // ];
  // directorate: Directorate[] = [
  //   { id: "0", name: "All" }
  // ];
  constructor(private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    let sabUserInformation: any = localStorage.getItem('sabUserInformation');
    this.mainUrl = this.configService.baseUrl;
    this.userInformation = JSON.parse(sabUserInformation);
    this.isAdmin = this.userInformation.admin;
    this.form = this.fb.group({
      year: [null, [Validators.required]],
      report: [null, [Validators.required]],
      department: [null],
      directorate: [null],
    });
    this.getYear();
    this.getDirectorateData();
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  }

  getYear() {
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      setTimeout(() => {
        this.selectedYear = this.years[0].value;
        this.form.controls.year.reset(this.years[0].value)
      }, 1000)
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  getDirectorateData() {
    let url = 'UserController/getsabDirectorates';
    this._loading.setLoading(true, url);
    this.directorateAllValues = [{ id: "All", name: "All" }];
    this.directorateList = ['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key: any) => {
        this.directorateAllValues.push({ id: key, name: response[key] })
        this.directorateList.push(response[key])
      })
      this.directorateAllValues.sort((a: any, b: any) => {
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

      setTimeout(() => {
        // this.selectedDirectorate = this.directorate[0].id;
        //       this.selectedReport = this.reportType[0].value
        //       this.form.controls.report.reset(this.reportType[0].value);
        let filterDirectorate: any = localStorage.getItem('sabDelayStatFilterDirectorate');
        if (filterDirectorate != null) {
          this.isFilterSelected = true;
          // this.directorateData.setValue(JSON.parse(filterDirectorate))
        } else {
          localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify([]));
        }
        this.isDirectorateFirst = false;
      }, 1000)
      this.getDepartmentData();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  // getDirectorateData() {
  //   let url = 'UserController/getsabDirectorates';
  //   this._loading.setLoading(true, url);
  //   this.coreService.get(url).subscribe(response => {
  //     this._loading.setLoading(false, url);
  //     Object.keys(response).forEach((key) => {
  //       this.directorate.push({ id: key, name: response[key] })
  //     })
  //     setTimeout(() => {
  //       this.selectedDirectorate = this.directorate[0].id;
  //       this.selectedReport = this.reportType[0].value
  //       this.form.controls.report.reset(this.reportType[0].value);
  //     }, 1000)
  //     // this.getDepartmentData();
  //   }, error => {
  //     this._loading.setLoading(false, url);
  //     console.log('error :' , error);
  //   });
  // }

  // getDepartmentData() {
  //   this.department = [
  //     { id: "0", name: "All" }
  //   ];
  //   let url = 'UserController/getsabDepartments?directorateId=' + this.selectedDirectorate;
  //   this._loading.setLoading(true, url);
  //   this.coreService.get(url).subscribe(response => {
  //     this._loading.setLoading(false, url);
  //     Object.keys(response).forEach((key) => {
  //       this.department.push({ id: key, name: response[key] })
  //     })
  //   }, error => {
  //     this._loading.setLoading(false, url);
  //     console.log('error :' , error);
  //   });
  // }

  departmentChange(event: any) {
    if (!this.isDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isDepartmentFirst = true;
        if (event.source._selected) {
          this.departmentData.setValue(this.departmentList)
          localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify([]));
        } else {
          this.departmentData.setValue([]);
          localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify(this.departmentList));
        }
        this.isDepartmentFirst = false;
      } else {
        this.isDepartmentFirst = true;
        let filter: any = localStorage.getItem('sabDelayStatFilterDepartment');

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
              localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify(filter));
              if ((this.departmentData.value.length + 1) == this.departmentList.length) {
                this.isDepartmentFirst = true;
                this.departmentData.setValue(this.departmentList);
                localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify([]));
                this.isDepartmentFirst = false;
              }
              this.isDepartmentFirst = false;
            }, 300)
          }

        }

      }

    }
  }

  getDepartmentData() {
    let url = 'UserController/getsabDepartments';

    if (!this.isAdmin) {
      url = url + '?directorateId=' + this.userInformation.sabMember.directorateCode
    }
    this._loading.setLoading(true, url);
    this.departmentAllValues = [{ id: "All", name: "All" }];
    this.departmentList = ['All'];
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      Object.keys(response).forEach((key) => {
        this.departmentAllValues.push({ id: key, name: response[key] })
        this.departmentList.push(response[key])
      })
      this.departmentAllValues.sort((a: any, b: any) => {
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
      setTimeout(() => {
        // this.departmentData.setValue(this.departmentList);
        let filterDepartment: any = localStorage.getItem('sabDelayStatFilterDepartment');
        if (filterDepartment != null) {
          this.isFilterSelected = true;
          // this.departmentData.setValue(JSON.parse(filterDepartment))
        } else {
          localStorage.setItem('sabDelayStatFilterDepartment', JSON.stringify([]));
        }
        this.isDepartmentFirst = false;
      }, 1000)
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });

  }

  directorateChange(event: any) {
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorate.setValue(this.directorateList)
          localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify([]));
        } else {
          this.directorate.setValue([]);
          localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabDelayStatFilterDirectorate');
        if (!event.source._selected) {
          setTimeout(() => {
            this.isDirectorateFirst = true;
            if (this.directorate.value[0] == 'All') {
              let data = [...this.directorate.value];
              data.splice(0, 1);
              this.directorate.setValue(data);
            }
            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter)
              filter = [...filter, event.source.value]
              localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify(filter));
            } else {
              localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify(['All', event.source.value]));
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
              localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify(filter));
              if ((this.directorate.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorate.setValue(this.directorateList);
                localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify([]));
                this.isDirectorateFirst = false;
              }
              this.isDirectorateFirst = false;
            }, 300)
          }
          // this.isDirectorateFirst = false;
        }
      }

    }
    // this.getDepartmentData();
  }
  msExcel() {
    let departmentData: string = '';
    let directorate: string = '';
    let obsData: any[] = [];
    for (let i = 0; i < this.departmentAllValues.length; i++) {
      if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
        for (let j = 0; j < this.departmentData.value.length; j++) {
          if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
            if (departmentData == '') {
              departmentData = this.departmentAllValues[i].id
            } else {
              departmentData = departmentData + "," + this.departmentAllValues[i].id;
            }
          }
        }
      }
    }
    for (let i = 0; i < this.directorateAllValues.length; i++) {
      if (this.directorate && this.directorate.value && this.directorate.value.length) {
        for (let j = 0; j < this.directorate.value.length; j++) {
          if (this.directorate.value[j] == this.directorateAllValues[i].name) {
            if (directorate == '') {
              directorate = this.directorateAllValues[i].id
            } else {
              directorate = directorate + "," + this.directorateAllValues[i].id;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All'
    }
    if (this.directorate && this.directorate.value && this.directorateAllValues.length == this.directorate.value.length) {
      directorate = 'All'
    }
    this.isLoading = true;
    let url = 'ReminderAndClassificationExportController/exportObesrvationsPerDepToExcel?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorate + '&depId=' + departmentData
    window.open(this.mainUrl + url, '_parent');
  }

  msWord() {
    let departmentData: string = '';
    let directorate: string = '';
    let obsData: any[] = [];
    for (let i = 0; i < this.departmentAllValues.length; i++) {
      if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
        for (let j = 0; j < this.departmentData.value.length; j++) {
          if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
            if (departmentData == '') {
              departmentData = this.departmentAllValues[i].id
            } else {
              departmentData = departmentData + "," + this.departmentAllValues[i].id;
            }
          }
        }
      }
    }
    for (let i = 0; i < this.directorateAllValues.length; i++) {
      if (this.directorate && this.directorate.value && this.directorate.value.length) {
        for (let j = 0; j < this.directorate.value.length; j++) {
          if (this.directorate.value[j] == this.directorateAllValues[i].name) {
            if (directorate == '') {
              directorate = this.directorateAllValues[i].id
            } else {
              directorate = directorate + "," + this.directorateAllValues[i].id;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All'
    }
    if (this.directorate && this.directorate.value && this.directorateAllValues.length == this.directorate.value.length) {
      directorate = 'All'
    }
    this.isLoading = true;
    let url = 'ReminderAndClassificationExportController/exportObesrvationsPerDepToWord?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorate + '&depId=' + departmentData
    window.open(this.mainUrl + url, '_parent');
  }
  search() {
    // if (this.form.status == "INVALID") {
    //   return;
    // }
    // else {
      let departmentData: string = '';
      let directorate: string = '';
      let obsData: any[] = [];
      for (let i = 0; i < this.departmentAllValues.length; i++) {
        if (this.departmentData && this.departmentData.value && this.departmentData.value.length) {
          for (let j = 0; j < this.departmentData.value.length; j++) {
            if (this.departmentData.value[j] == this.departmentAllValues[i].name) {
              if (departmentData == '') {
                departmentData = this.departmentAllValues[i].id
              } else {
                departmentData = departmentData + "," + this.departmentAllValues[i].id;
              }
            }
          }
        }
      }
      for (let i = 0; i < this.directorateAllValues.length; i++) {
        if (this.directorate && this.directorate.value && this.directorate.value.length) {
          for (let j = 0; j < this.directorate.value.length; j++) {
            if (this.directorate.value[j] == this.directorateAllValues[i].name) {
              if (directorate == '') {
                directorate = this.directorateAllValues[i].id
              } else {
                directorate = directorate + "," + this.directorateAllValues[i].id;
              }
            }
          }
        }
      }
      if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
        departmentData = 'All'
      }
      if (this.directorate && this.directorate.value && this.directorateAllValues.length == this.directorate.value.length) {
        directorate = 'All'
      }
      this.isLoading = true;
      let url = 'SearchController/searchObesrvationsPerDeps?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorate + '&depId=' + departmentData
     
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        // let response = [{"code":"101330","name":"Deputy C.E.O. For Planning & Finance","obsCount":2,"departments":[{"code":"103010","name":"Corporate Planning","obsCount":1},{"code":"117010","name":"Local Marketing","obsCount":1}]},{"code":"-4","name":"N/A","obsCount":1,"departments":[{"code":"-4","name":"N/A","obsCount":1}]},{"code":"-3","name":"Committee","obsCount":1,"departments":[{"code":"-3","name":"Committee","obsCount":1}]}]
        this.searchedYear = this.selectedYear;
        this.searchedReport = this.selectedReport;
        if(this.selectedReport =='KNPC Response Report'){
          this.searchedReportName = 'Initial Report';
        }else{
        this.searchedReportName = this.selectedReport;
        }
        this.data = [];
        let tempDate = [];
        this.totalObservations = 0;
        if (response.length == 0) {
          this.data = response;
          this._alldata = this.data;
          this.length = this._alldata.length;
          this.dataSource = new MatTableDataSource(this.addGroups(this._alldata, this.groupByColumns));
          // this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          if (this.dataSource.data && this.dataSource.data.length > 0 && this.dataSource.data[0] instanceof Group) {
            this.dataSource.data[0].expanded = true
          }
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
        } else {
          for (let i = 0; i < response.length; i++) {
            for (let j = 0; j < response[i].departments.length; j++) {
              if (response[i].code == "-3" || response[i].code == "-2" || response[i].code == "-4") {
                tempDate.push({
                  "department": response[i].departments[j].name,
                  "directorate": response[i].name ? response[i].name : '',
                  "total": response[i].departments[j].obsCount,
                  "directorate_obsCount": response[i].obsCount
                })
              } else {
                this.data.push({
                  "department": response[i].departments[j].name,
                  "directorate": response[i].name,
                  "total": response[i].departments[j].obsCount,
                  "directorate_obsCount": response[i].obsCount
                })
              }
              this.totalObservations = this.totalObservations + response[i].departments[j].obsCount
            }
            if (response.length - 1 == i) {
              this.data = [...this.data, ...tempDate]
              this._alldata = this.data;
              this.length = this._alldata.length
              this.dataSource = new MatTableDataSource(this.addGroups(this._alldata, this.groupByColumns));
              // this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
              if (this.dataSource.data && this.dataSource.data.length > 0 && this.dataSource.data[0] instanceof Group) {
                this.dataSource.data[0].expanded = true
              }
              this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
              this.dataSource.filter = performance.now().toString();
            }
          }
        }
      }, error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :', error);
      });
    
  }


  groupBy(event: any, column: any) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field: any, add: any) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event: any, column: any) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter((row) => {
      // if (!(row instanceof Group)) {
      //   return false;
      // }
      let match = true;
      this.groupByColumns.forEach(column => {
        if (!row[column] || !data[column] || row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    });
    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row: any) {
    // for(let i = 0 ;i < this.dataSource.data.length ;i++){
    //   if(this.dataSource.data[i] instanceof Group && JSON.stringify(row) != JSON.stringify(this.dataSource.data[i])){
    //     this.dataSource.data[i].expanded = false
    //   }
    //   if(i == this.dataSource.data.length - 1){      
    row.expanded = !row.expanded;
    //   }
    // }
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(data.map(
      row => {
        let result: any = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }
    ), JSON.stringify);
    const currentColumn = groupByColumns[level];
    let subGroups: any = [];
    groups.forEach((group: any) => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      if (rowsInGroup && rowsInGroup.length > 0) {
        group.totalCounts = rowsInGroup[0].directorate_obsCount;
      }
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a: any, key: any) {
    let seen: any = {};
    return a.filter((item: any) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index: any, item: any): boolean {
    return item.level;
  }
}