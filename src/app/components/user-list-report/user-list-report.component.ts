import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Department, Directorate } from '../search-observations/search-observations.component';
import { FormControl } from '@angular/forms';

export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

export interface UserListData {
  "loginId": string,
  "userName": string,
  "userTitle": string,
  "departmentName": string,
  "supervisorLogin": string,
  "departmentCode": number,
  "divisionCode": number,
  "directorateName": string,
  "directorateCode": number,
  "userMail": string
}


@Component({
  selector: 'app-user-list-report',
  templateUrl: './user-list-report.component.html',
  styleUrls: ['./user-list-report.component.css']
})
export class UserListReportComponent implements OnInit {
  // data = ELEMENT_DATA;
  public dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['userName', 'loginId', 'userTitle'];
  displayedColumnsSmallMob: string[] = ['userName', 'userTitle'];
  groupByColumns: string[] = ['departmentName'];
  isRtl: any;
  isLoading: boolean = true;
  _alldata: any[];
  columns: any[];
  innerWidth  = 0;
  sabUserInformation: any = {};
  sabDelegateUser: any ;
  departmentAllValues: Department[] = [{ id: "All", name: "All" }];
  departmentData = new FormControl();
  directorateAllValues: Directorate[] = [{ id: "All", name: "All" }];
  directorateData = new FormControl();
  selectedYear: string;
  mainUrl: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) triggerBtn: MatMenuTrigger;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
  ) {
    this.columns = [{
      field: 'userName'
    }, {
      field: 'loginId'
    }, {
      field: 'userTitle'
      // }, {
      //   field: 'userMail'
      // }, {
      //   field: 'departmentName'
    }
    ];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['departmentName'];
  }

  ngOnInit(): void {
    let data: any = localStorage.getItem('sabUserInformation');
    this.sabUserInformation = JSON.parse(data);
    this.mainUrl = this.configService.baseUrl;
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if(sabDelegateUser){
      this.sabDelegateUser = JSON.parse(sabDelegateUser);
    }
    this.getUserList();
    this.innerWidth =  window.innerWidth;
  }

  onResize(event:any) {
    this.innerWidth =  window.innerWidth;
   }
 async getUserList() {
    this.isLoading = true;
    console.log(this.sabUserInformation)    
    let url = 'UserController/getUsersListReport?currentUserId=' + this.sabUserInformation.sabMember.loginId +  '&isGNPA=' + this.sabUserInformation.admin ;
    // let url = 'inboxController/getInboxWorkItems?isAdmin=' + this.isAdmin + '&userLogin=' + this.userId 
    if (this.sabDelegateUser) {
      url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabDelegateUser.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.sabDelegateUser.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember.userJobTitle == 'SEC') {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode +'&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle +'&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    }

    console.log(url)
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
      // let response = [{"loginId":"AEB027","userName":"ANFAL ESSA ESMAEIL BAHZAD","userTitle":"00246800 - Eng., PQ","departmentName":"Commercial","supervisorLogin":"MAF019","departmentCode":104100,"divisionCode":104460,"directorateName":"Deputy C.E.O. For Fin. & Admin. Affairs","directorateCode":101260,"userMail":"AEB027@knpc.com"},{"loginId":"AHB028","userName":"ANFAL HUSAIN ABDULLAH ALBANNA","userTitle":"00285199 - Eng.-C,Projects Stage Gate Control","departmentName":"Management Support","supervisorLogin":"BKH022","departmentCode":110201,"divisionCode":110250,"directorateName":"Deputy C.E.O. For Planning & LM","directorateCode":101250,"userMail":"AHB028@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},{"loginId":"AHH030","userName":"AASEM","userTitle":"Operator,Field II - PAAET (A)","departmentName":"Operations - MAA","supervisorLogin":"CSS011","departmentCode":402010,"divisionCode":402070,"directorateName":"Deputy C.E.O. For MAA Ref.","directorateCode":101240,"userMail":"AHH030@knpc.com"},]
      this.isLoading = false;
      this._loading.setLoading(false, url);

      await response.sort((a: any, b: any) => (a.userName < b.userName) ? 1 : -1);
      await response.sort((a: any, b: any) => (a.departmentName > b.departmentName) ? 1 : -1);
      this._alldata = response;
      this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
      if (this.dataSource.data && this.dataSource.data.length > 0 && this.dataSource.data[0] instanceof Group) {
        this.dataSource.data[0].expanded = true;
      }
      this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
      this.dataSource.filter = performance.now().toString();
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
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
      this.groupByColumns.forEach((column: any) => {
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
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i] instanceof Group && JSON.stringify(row) != JSON.stringify(this.dataSource.data[i])) {
        this.dataSource.data[i].expanded = false
      }
      if (i == this.dataSource.data.length - 1) {
        row.expanded = !row.expanded;
      }
    }
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
    const groups = this.uniqueBy(
      data.map(
        row => {
          let result: any = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);
    const currentColumn = groupByColumns[level];
    let subGroups: any = [];
    groups.forEach((group: any) => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
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
    let url = 'ReminderAndClassificationExportController/exportUserListExcel?currentUserId=' + this.sabUserInformation.sabMember.loginId +  '&isGNPA=' + this.sabUserInformation.admin ;
    // let url = 'inboxController/getInboxWorkItems?isAdmin=' + this.isAdmin + '&userLogin=' + this.userId 
    if (this.sabDelegateUser) {
      url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabDelegateUser.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.sabDelegateUser.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember.userJobTitle == 'SEC') {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode +'&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle +'&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    window.open(this.mainUrl + url, '_parent');
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
    let url = 'ReminderAndClassificationExportController/exportUserListToWord?currentUserId=' + this.sabUserInformation.sabMember.loginId +  '&isGNPA=' + this.sabUserInformation.admin ;
    // let url = 'inboxController/getInboxWorkItems?isAdmin=' + this.isAdmin + '&userLogin=' + this.userId 
    if (this.sabDelegateUser) {
      url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabDelegateUser.departmentCode + '&isDelegatedUser=true&onBehalfOf=' + this.sabDelegateUser.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember.userJobTitle == 'SEC') {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle + '&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode +'&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&currentUserTitle=' + this.sabUserInformation.sabMember.userJobTitle +'&currentUserDepID=' + this.sabUserInformation.sabMember.departmentCode + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
    window.open(this.mainUrl + url, '_parent');
  }
}
}