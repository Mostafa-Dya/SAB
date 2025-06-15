import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { userInfo } from 'os';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;
  totalCount =0
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


export interface Directorate {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface ReportDataTable {
  department: string,
  manager: number,
  teamLeader: number,
  user: number,
  total: number,
  organization: string;
  totalCount:number;
  projects: string;
}


@Component({
  selector: 'app-delay-report',
  templateUrl: './delay-report.component.html',
  styleUrls: ['./delay-report.component.css']
})

export class DelayReportComponent implements OnInit {
  data: any = [];
  public dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['department', 'manager', 'teamLeader', 'user', 'total'];
  displayedColumnsSmallMob: string[] = ['department', 'total'];
  groupByColumns: string[] = ['organization'];
  isRtl: any;
  _alldata: any[];
  isLoading: boolean = true;
  length: number = 0;
  // Filters
  selectedYear: string;
  selectedReport: string = 'KNPC Response Report';
  mainUrl: string;
  isFilterSelected: boolean;
  selectedDelegateUserInfo: any;
  isDirectorateVisible: boolean = true;
  isDepartmentVisible: boolean = true;
  selectedDirectorate: string;
  selectedDepartment: string;
  directorateData = new FormControl();
  directorateList: string[] = ['All'];
  directorateAllValues: Directorate[] = [{ id: "All", name: "All" }];
  departmentAllValues: Department[] = [{ id: "All", name: "All" }];
  isDirectorateFirst: any = false;
  departmentData = new FormControl();
  departmentList: string[] = ['All'];
  isDepartmentFirst: any = false;
  delayInfo: any;
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
  userInformation: any;
  userJobTitle: any;
  isAdmin: any;
  innerWidth = 0;
  constructor(private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService) { }

  ngOnInit(): void {
    let sabUserInformation: any = localStorage.getItem('sabUserInformation');
    this.mainUrl = this.configService.baseUrl;
    this.userInformation = JSON.parse(sabUserInformation);
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.isAdmin = this.userInformation.admin;
    this.selectedYear = this.userInformation.reportYear;
    this.innerWidth = window.innerWidth;
    this.getDirectorateData()
    this.getYear();
  }

  getYear() {
    // let url = 'uploadReportController/getReportYears';
    // this._loading.setLoading(true, url);
    // this.coreService.get(url).subscribe(response => {
    //   this._loading.setLoading(false, url);
    //   response.map((data: any) => {
    //     this.years.push({ value: data })
    //   })
    //   this.years.reverse();
    //   setTimeout(() => {
    //     this.selectedYear = this.years[0].value;
    //     // this.form.controls.year.reset(this.years[0].value)
    //   }, 1000)
    // }, error => {
    //   this._loading.setLoading(false, url);
    //   console.log('error :' , error);
    // });

    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      let years: any[] = [];
      response.map((data: any) => {
        years.push({ value: data })
      })
      years.reverse();
      this.years = [...this.years, ...years];
      this.selectedYear = this.years[0].value;
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  onResize(event: any) {
    this.innerWidth = window.innerWidth;
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
    const groups = this.uniqueBy(data.map(row => {
      let result: any = new Group();
      result.level = level + 1;
      result.parent = parent;
      for (let i = 0; i <= level; i++) {
        result[groupByColumns[i]] = row[groupByColumns[i]];
      }
      return result;
    }), JSON.stringify);
    const currentColumn = groupByColumns[level];
    let subGroups: any = [];
    groups.forEach((group: any) => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      let totalCount = data.find(row => row.organization === group.organization);
      group.totalCount = totalCount.totalCount;
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

  getDelayReport() {
    let departmentData: string = '';
    let directorateData: string = '';
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
      if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
        for (let j = 0; j < this.directorateData.value.length; j++) {
          if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
            if (directorateData == '') {
              directorateData = this.directorateAllValues[i].id
            } else {
              directorateData = directorateData + "," + this.directorateAllValues[i].id;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All'
    }
    if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
      directorateData = 'All'
    }
    let url = 'SearchController/searchDelayReport?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorateData + '&depId=' + departmentData
    if (this.selectedDelegateUserInfo) {
      url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId;
    } else {
      if (this.userJobTitle == 'SEC') {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url = url + '&userJobTitle=' + this.userJobTitle + '&isDelegatedUser=false&onBehalfOf=' + this.userInformation.sabMember.loginId;
      }
    }
    this.data = [];
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response:any) => {
      this._loading.setLoading(false, url);

      //  response = [{"code":"101330","name":"Deputy C.E.O. For Planning & Finance","count":27,"departments":[{"deptCode":103010,"deptName":"Corporate Planning","pendingUser":0,"pendingManager":0,"pendingTl":0,"count":27}]},{"code":"101280","name":"Deputy C.E.O. For Support Services","count":5,"departments":[{"deptCode":196100,"deptName":"Information Technology","pendingUser":0,"pendingManager":0,"pendingTl":0,"count":5}]},{"code":"101210","name":"Deputy C.E.O. For Fuel Supply Operations","count":2,"departments":[{"deptCode":117010,"deptName":"Local Marketing","pendingUser":0,"pendingManager":0,"pendingTl":0,"count":2}]}]

      for (let i = 0; i < response.length; i++) {
        for (let j = 0; j < response[i].departments.length; j++) {
          this.data.push({
            department: response[i].departments[j].deptName,
            manager: response[i].departments[j].pendingManager,
            teamLeader: response[i].departments[j].pendingTl,
            user: response[i].departments[j].pendingUser,
            total: response[i].departments[j].count,
            organization: response[i].name,
            totalCount: response[i].count
          })
        }
      }
      this._alldata = this.data;
      this.length = this._alldata.length
      this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
      if (this.dataSource.data && this.dataSource.data.length > 0 && this.dataSource.data[0] instanceof Group) {
        this.dataSource.data[0].expanded = true
      }
      this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
      this.dataSource.filter = performance.now().toString();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error : ', error);
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
        // this.directorateData.setValue(this.directorateList);
        // console.log(this.directorateData, 'directorateData',this.directorateList, 'directorateList' )
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
        console.log(this.departmentData)
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

  directorateChange(event: any) {
    console.log(this.isDirectorateFirst)
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorateData.setValue(this.directorateList)
          localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify([]));
        } else {
          this.directorateData.setValue([]);
          localStorage.setItem('sabDelayStatFilterDirectorate', JSON.stringify(this.directorateList));
        }
        this.isDirectorateFirst = false;
      } else {
        this.isDirectorateFirst = true;
        let filter: any = localStorage.getItem('sabDelayStatFilterDirectorate');
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
              if ((this.directorateData.value.length + 1) == this.directorateList.length) {
                this.isDirectorateFirst = true;
                this.directorateData.setValue(this.directorateList);
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
  }

  msWord() {
    let departmentData: string = '';
    let directorateData: string = '';
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
      if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
        for (let j = 0; j < this.directorateData.value.length; j++) {
          if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
            if (directorateData == '') {
              directorateData = this.directorateAllValues[i].id
            } else {
              directorateData = directorateData + "," + this.directorateAllValues[i].id;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All'
    }
    if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
      directorateData = 'All'
    }
    let url = 'ReminderAndClassificationExportController/exportDelayReportToWord?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorateData + '&depId=' + departmentData;
    window.open(this.mainUrl + url, '_parent');
  }

  msExcel() {
    let departmentData: string = '';
    let directorateData: string = '';
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
      if (this.directorateData && this.directorateData.value && this.directorateData.value.length) {
        for (let j = 0; j < this.directorateData.value.length; j++) {
          if (this.directorateData.value[j] == this.directorateAllValues[i].name) {
            if (directorateData == '') {
              directorateData = this.directorateAllValues[i].id
            } else {
              directorateData = directorateData + "," + this.directorateAllValues[i].id;
            }
          }
        }
      }
    }
    if (this.departmentData && this.departmentData.value && this.departmentAllValues.length == this.departmentData.value.length) {
      departmentData = 'All'
    }
    if (this.directorateData && this.directorateData.value && this.directorateAllValues.length == this.directorateData.value.length) {
      directorateData = 'All'
    }
    let url = 'ReminderAndClassificationExportController/exportDelayReportToExcel?reportYear=' + this.selectedYear + '&reportCycle=' + this.selectedReport + '&dirId=' + directorateData + '&depId=' + departmentData;
    window.open(this.mainUrl + url, '_parent');
  }


}
