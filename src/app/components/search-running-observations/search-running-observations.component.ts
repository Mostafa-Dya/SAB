import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
  name: string;
}

export interface Status {
  value: string;
  name: string;
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
  obsId: string;
  obsTitle: string;
  obsSeq: number;
  sentDate: string;
  reportName: string;
  deptName: string;
  responseStatus: string;
  directorateName: string;
  respondOnBehalf: string;
  sentToMultipleDept: string;
  pendingUser: string;
  stepCustomId: string;
  reponseType: string;
  deptCode: number;
}

@Component({
  selector: 'app-search-running-observations',
  templateUrl: './search-running-observations.component.html',
  styleUrls: ['./search-running-observations.component.css']
})
export class SearchRunningObservationsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<ObservationData>;
  displayedColumns: string[] = ['select', 'obsSeq', 'obsTitle', 'sentDate', 'deptName', 'responseStatus', 'directorate', 'respondOnBehalf', 'sentToMultipleDept'];
  displayedColumnsMob: string[] = ['select', 'obsTitle'];
  selection = new SelectionModel<ObservationData>(true, []);
  years: Years[] = [];
  status: Status[] = [
    { value: "", name: "All" }
  ];
  classifications: Classification[] = [
    { value: "", name: "الكل" },
    { value: "NEW", name: "جديدة" },
    { value: "REPEATED", name: "متكررة" }
  ];
  directorateValue: Directorate[] = [
    { id: "0", name: "All" }
  ];
  departmentValue: Department[] = [
    { id: "0", name: "All" }
  ];
  observationData: ObservationData[] = []
  selectedYear: string;
  selectedStatus: string;
  selectedClassification: string;
  selectedDirectorate: string;
  selectedDepartment: string;
  obsTitle: string = '';
  runningObservationData: any;
  sequenceList: string[] = ['All'];
  departmentList: string[] = ['All'];
  statusList: string[] = ['All'];
  directorateList: string[] = ['All'];
  respondBehalfList: string[] = ['All'];
  sendMultiDepartmentList: string[] = ['All'];
  sequenceData = new FormControl();
  departmentData = new FormControl();
  statusData = new FormControl();
  directorateData = new FormControl();
  respondBehalfData = new FormControl();
  sendMultiDepartmentData = new FormControl();
  isSequenceFirst: any = true;
  isDepartmentFirst: any = true;
  isStatusFirst: any = true;
  isDirectorateFirst: any = true;
  isrRespondBehalfFirst: any = true;
  isSendMultiDepartmentFirst: any = true;
  isLoading: boolean;
  userInformation: any;
  loginId:string;
  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.loginId = localStorage.getItem('loginId') || '';
    this.years.push({ value: this.userInformation.reportYear, name: this.userInformation.reportYear })
    this.selectedYear = this.years[0].value;
    this.getResponseStatus();
    this.selectedClassification = this.classifications[0].value;
    this.getDirectorateData();
 
  }
  
  getResponseStatus() {
    this.isLoading = true;
    let url = 'InProgController/getResposeStatus';
    this.coreService.get(url).subscribe(response => {
      // this.isLoading = false;
      response.map((data: any) => {
        this.status.push({ value: data, name: data })
      })
      this.selectedStatus = this.status[0].value;
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
    });
  }

  getDirectorateData() {
    this.isLoading = true;
    let url = 'UserController/getsabDirectorates';
    this.coreService.get(url).subscribe(response => {
      // this.isLoading = false;
      Object.keys(response: any).forEach((key) => {
        this.directorateValue.push({ id: key, name: response[key] })
      })
      this.selectedDirectorate = this.directorateValue[0].id;
      this.getDepartmentData();
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
    });
  }

  getDepartmentData() {
    this.isLoading = true;
    this.departmentValue = [
      { id: "0", name: "All" }
    ];
    let url = 'UserController/getsabDepartments?directorateId=' + this.selectedDirectorate;
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      Object.keys(response: any).forEach((key) => {
        this.departmentValue.push({ id: key, name: response[key] })
      })
      this.selectedDepartment = this.departmentValue[0].id;
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
    });
  }

  getRunningObsData() {
    this.isLoading = true;
    this.sequenceList = ['All'];
    this.departmentList = ['All'];
    this.statusList = ['All'];
    this.directorateList = ['All'];
    this.respondBehalfList = ['All'];
    this.sendMultiDepartmentList = ['All'];
    this.isSequenceFirst = true;
    this.isDepartmentFirst = true;
    // this.isStatusFirst = true;
    this.isDirectorateFirst = true;
    this.isrRespondBehalfFirst = true;
    this.isSendMultiDepartmentFirst = true;
    let url = 'InProgController/getRunningObservations?title=' + this.obsTitle + '&responseStatus=' + this.selectedStatus + '&classification=' + this.selectedClassification + '&directorateCode=' + this.selectedDirectorate + '&departmentCode=' + this.selectedDepartment;
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      response.map((data: any) => {
        this.sequenceList.push(data.obsSeq);
        this.departmentList.push(data.deptName);
        // this.statusList.push(data.responseStatus);
        this.directorateList.push(data.directorateName);
        this.respondBehalfList.push(data.respondOnBehalf);
        this.sendMultiDepartmentList.push(data.sentToMultipleDept);
      })
      let sequenceSet = new Set(this.sequenceList);
      this.sequenceList = [...sequenceSet];
      this.sequenceData.setValue(this.sequenceList);
      let departmentSet = new Set(this.departmentList);
      this.departmentList = [...departmentSet];
      this.departmentData.setValue(this.departmentList);
      // let statusSet = new Set(this.statusList);
      // this.statusList = [...statusSet];
      // this.statusData.setValue(this.statusList);
      let directorateSet = new Set(this.directorateList);
      this.directorateList = [...directorateSet];
      this.directorateData.setValue(this.directorateList);
      let respondBehalfSet = new Set(this.respondBehalfList);
      this.respondBehalfList = [...respondBehalfSet];
      this.respondBehalfData.setValue(this.respondBehalfList);
      let sendMultiDepartmentSet = new Set(this.sendMultiDepartmentList);
      this.sendMultiDepartmentList = [...sendMultiDepartmentSet];
      this.sendMultiDepartmentData.setValue(this.sendMultiDepartmentList);
      this.runningObservationData = response;
      setTimeout(() => {
        this.isSequenceFirst = false;
        this.isDepartmentFirst = false;
        // this.isStatusFirst = false;
        this.isDirectorateFirst = false;
        this.isrRespondBehalfFirst = false;
        this.isSendMultiDepartmentFirst = false;
      }, 500)
      this.dataSource = new MatTableDataSource(response: any);
    }, error => {
      this.isLoading = false;
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

  checkboxLabel(row?: ObservationData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.obsSeq + 1}`;
  }

  navigateTo(row: any) {
    this.router.navigate(['running-observations/observation-details', row.stepCustomId]);
  }

  sequenceChange(event: any) {
    if (!this.isSequenceFirst) {
      if (event.source.value == 'All') {
        this.isSequenceFirst = true;
        if (event.source._selected) {
          this.sequenceData.setValue(this.sequenceList);
        } else {
          this.sequenceData.setValue([]);
        }
        this.isSequenceFirst = false;
      } else {
        if (event.source._selected) {
          setTimeout(() => {
            if ((this.sequenceData.value.length + 1) == this.sequenceList.length) {
              this.isSequenceFirst = true;
              this.sequenceData.setValue(this.sequenceList);
              this.isSequenceFirst = false;
            }
          }, 300)
        } else {
          setTimeout(() => {
            if (this.sequenceData.value[0] == 'All') {
              this.isSequenceFirst = true;
              let data = [...this.sequenceData.value];
              data.splice(0, 1);
              this.sequenceData.setValue(data);
              this.isSequenceFirst = false;
            }
          }, 300)
        }
      }
      this.updateDataSource();
    }
  }

  departmentChange(event: any) {
    if (!this.isDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isDepartmentFirst = true;
        if (event.source._selected) {
          this.departmentData.setValue(this.departmentList);
        } else {
          this.departmentData.setValue([]);
        }
        this.isDepartmentFirst = false;
      } else {
        if (event.source._selected) {
          setTimeout(() => {
            if ((this.departmentData.value.length + 1) == this.departmentList.length) {
              this.isDepartmentFirst = true;
              this.departmentData.setValue(this.departmentList);
              this.isDepartmentFirst = false;
            }
          }, 300)
        } else {
          setTimeout(() => {
            if (this.departmentData.value[0] == 'All') {
              this.isDepartmentFirst = true;
              let data = [...this.departmentData.value];
              data.splice(0, 1);
              this.departmentData.setValue(data);
              this.isDepartmentFirst = false;
            }
          }, 300)
        }
      }
      this.updateDataSource();
    }
  }

  // statusChange(event: any) {
  //   if (!this.isStatusFirst) {
  //     if (event.source.value == 'All') {
  //       this.isStatusFirst = true;
  //       if (event.source._selected) {
  //         this.statusData.setValue(this.statusList);
  //       } else {
  //         this.statusData.setValue([]);
  //       }
  //       this.isStatusFirst = false;
  //     } else {
  //       if (event.source._selected) {
  //         setTimeout(() => {
  //           if ((this.statusData.value.length + 1) == this.statusList.length) {
  //             this.isStatusFirst = true;
  //             this.statusData.setValue(this.statusList);
  //             this.isStatusFirst = false;
  //           }
  //         }, 300)
  //       } else {
  //         setTimeout(() => {
  //           if (this.statusData.value[0] == 'All') {
  //             this.isStatusFirst = true;
  //             let data = [...this.statusData.value];
  //             data.splice(0, 1);
  //             this.statusData.setValue(data);
  //             this.isStatusFirst = false;
  //           }
  //         }, 300)
  //       }
  //     }
  //     this.updateDataSource();
  //   }
  // }

  directorateChange(event: any) {
    if (!this.isDirectorateFirst) {
      if (event.source.value == 'All') {
        this.isDirectorateFirst = true;
        if (event.source._selected) {
          this.directorateData.setValue(this.directorateList);
        } else {
          this.directorateData.setValue([]);
        }
        this.isDirectorateFirst = false;
      } else {
        if (event.source._selected) {
          setTimeout(() => {
            if ((this.directorateData.value.length + 1) == this.directorateList.length) {
              this.isDirectorateFirst = true;
              this.directorateData.setValue(this.directorateList);
              this.isDirectorateFirst = false;
            }
          }, 300)
        } else {
          setTimeout(() => {
            if (this.directorateData.value[0] == 'All') {
              this.isDirectorateFirst = true;
              let data = [...this.directorateData.value];
              data.splice(0, 1);
              this.directorateData.setValue(data);
              this.isDirectorateFirst = false;
            }
          }, 300)
        }
      }
      this.updateDataSource();
    }
  }

  respondBehalfChange(event: any) {
    if (!this.isrRespondBehalfFirst) {
      if (event.source.value == 'All') {
        this.isrRespondBehalfFirst = true;
        if (event.source._selected) {
          this.respondBehalfData.setValue(this.respondBehalfList);
        } else {
          this.respondBehalfData.setValue([]);
        }
        this.isrRespondBehalfFirst = false;
      } else {
        if (event.source._selected) {
          setTimeout(() => {
            if ((this.respondBehalfData.value.length + 1) == this.respondBehalfList.length) {
              this.isrRespondBehalfFirst = true;
              this.respondBehalfData.setValue(this.respondBehalfList);
              this.isrRespondBehalfFirst = false;
            }
          }, 300)
        } else {
          setTimeout(() => {
            if (this.respondBehalfData.value[0] == 'All') {
              this.isrRespondBehalfFirst = true;
              let data = [...this.respondBehalfData.value];
              data.splice(0, 1);
              this.respondBehalfData.setValue(data);
              this.isrRespondBehalfFirst = false;
            }
          }, 300)
        }
      }
      this.updateDataSource();
    }
  }

  sendMultiDepartmentChange(event: any) {
    if (!this.isSendMultiDepartmentFirst) {
      if (event.source.value == 'All') {
        this.isSendMultiDepartmentFirst = true;
        if (event.source._selected) {
          this.sendMultiDepartmentData.setValue(this.sendMultiDepartmentList);
        } else {
          this.sendMultiDepartmentData.setValue([]);
        }
        this.isSendMultiDepartmentFirst = false;
      } else {
        if (event.source._selected) {
          setTimeout(() => {
            if ((this.sendMultiDepartmentData.value.length + 1) == this.sendMultiDepartmentList.length) {
              this.isSendMultiDepartmentFirst = true;
              this.sendMultiDepartmentData.setValue(this.sendMultiDepartmentList);
              this.isSendMultiDepartmentFirst = false;
            }
          }, 300)
        } else {
          setTimeout(() => {
            if (this.sendMultiDepartmentData.value[0] == 'All') {
              this.isSendMultiDepartmentFirst = true;
              let data = [...this.sendMultiDepartmentData.value];
              data.splice(0, 1);
              this.sendMultiDepartmentData.setValue(data);
              this.isSendMultiDepartmentFirst = false;
            }
          }, 300)
        }
      }
      this.updateDataSource();
    }
  }

  updateDataSource() {
    setTimeout(() => {
      let sequence: any[] = [];
      let department: any[] = [];
      // let status: any[] = [];
      let directorate: any[] = [];
      let respondBehalf: any[] = [];
      let sendMultiDepartment: any[] = [];
      this.sequenceData.value.map((sequenceData: any) => {
        this.runningObservationData.map((data: any) => {
          if (sequenceData != 'All') {
            if (sequenceData == data.obsSeq) {
              sequence.push(data);
            }
          }
        })
      })
      this.departmentData.value.map((departmentData: any) => {
        sequence.map(data => {
          if (departmentData != 'All') {
            if (departmentData == data.deptName) {
              department.push(data);
            }
          }
        })
      })
      // this.statusData.value.map((statusData: any) => {
      //   department.map(data => {
      //     if (statusData != 'All') {
      //       if (statusData == data.responseStatus) {
      //         status.push(data);
      //       }
      //     }
      //   })
      // })
      this.directorateData.value.map((directorateData: any) => {
        department.map(data => {
          if (directorateData != 'All') {
            if (directorateData == data.directorateName) {
              directorate.push(data);
            }
          }
        })
      })
      this.respondBehalfData.value.map((respondBehalfData: any) => {
        directorate.map(data => {
          if (respondBehalfData != 'All') {
            if (respondBehalfData == data.respondOnBehalf) {
              respondBehalf.push(data);
            }
          }
        })
      })
      this.sendMultiDepartmentData.value.map((sendMultiDepartmentData: any) => {
        respondBehalf.map(data => {
          if (sendMultiDepartmentData != 'All') {
            if (sendMultiDepartmentData == data.sentToMultipleDept) {
              sendMultiDepartment.push(data);
            }
          }
        })
      })
      this.dataSource.data = sendMultiDepartment;
    }, 300)
  }

  DirectorateChange() {
    this.getDepartmentData();
  }

  reset() {
    this.obsTitle = '';
    this.selectedStatus = this.status[0].value;
    this.selectedYear = this.years[0].value;
    this.selectedClassification = this.classifications[0].value;
    this.selectedDirectorate = this.directorateValue[0].id;
    this.getDepartmentData();
    if(this.dataSource && this.dataSource.data) {
      this.dataSource.data = [];
    }
  }
}