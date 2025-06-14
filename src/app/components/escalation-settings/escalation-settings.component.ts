import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CoreService } from "src/app/services/core.service";
import { LoadingService } from "src/app/services/loading.service";
import { SharedVariableService } from "src/app/services/shared-variable.service";

export interface EscalationData {
  configurationKey: string;
  configurationValue: string;
  obsCategory: string;
  id: number;
  reportCycle: string;
}

@Component({
  selector: "app-escalation-settings",
  templateUrl: "./escalation-settings.component.html",
  styleUrls: ["./escalation-settings.component.css"],
})
export class EscalationSettingsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<EscalationData>;
  displayedColumns: string[] = [
    "reportCycle",
    "obsCategory",
    "configurationKey",
    "configurationValue",
    "action",
  ];
  isEscalationEnabled = true;
  displayedColumnsMob: string[] = ["reportCycle","action","configurationValue"];
  @ViewChild(MatSort) sort: MatSort;
  // ?=========================
  isLoading: boolean = false;
  EscalationData: EscalationData[];
  reportCycleData = new FormControl();
  reportCycleList: string[] = ["All"];
  isreportCycleFirst: any = true;

  obsCategoryData = new FormControl();
  obsCategoryList: string[] = ["All"];
  isobsCategoryFirst: any = true;

  configurationKeyData = new FormControl();
  configurationKeyList: string[] = ["All"];
  isconfigurationKeyFirst: any = true;
  // ================================
  constructor(
    private router: Router,
    private coreService: CoreService,
    private notification: NzNotificationService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.checkIsEscalationEnabled();
    this.getDelegatedUser();
  }

  getDelegatedUser() {

    // let response = [{"id":4,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":6,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":9,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":11,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":13,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":15,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":17,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":19,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":21,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":24,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":26,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":33,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":35,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":37,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":39,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":41,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":43,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":45,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":47,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"3"},{"id":49,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":51,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":1,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":5,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":8,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":10,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":12,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":14,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":16,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":18,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":20,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":22,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":25,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":32,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":34,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":36,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":38,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":40,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":42,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":44,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":46,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"7"},{"id":48,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"},{"id":50,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"}];
     let url = "settingsController/getEscalationSettingList";
    this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(
      async (response) => {

        this.isLoading = false;
        this._loading.setLoading(false, url); 
        let isFilterSelected = false;
        for (let i = 0; i < response.length; i++) {
          let data = response[i];
          this.reportCycleList.push(data.reportCycle);
          this.obsCategoryList.push(data.obsCategory);
          this.configurationKeyList.push(data.configurationKey);

        }
        //  ------------------------------------------------------------------
        let reportCycleSet = new Set(this.reportCycleList);
        this.reportCycleList = [...reportCycleSet];
        this.reportCycleData.setValue(this.reportCycleList);
        //  ------------------------------------------------------------------
        let obsCategorySet = new Set(this.obsCategoryList);
        this.obsCategoryList = [...obsCategorySet];       
        this.obsCategoryData.setValue(this.obsCategoryList);
        //  ------------------------------------------------------------------
        let configurationKeySet = new Set(this.configurationKeyList);
        this.configurationKeyList = [...configurationKeySet];
        this.configurationKeyData.setValue(this.configurationKeyList);
        //  ------------------------------------------------------------------
        this.EscalationData = response;
        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
        if (isFilterSelected) {
          this.updateDataSource();
        }
        
        setTimeout(() => {
          this.isreportCycleFirst = false;
          this.isobsCategoryFirst = false;
          this.isconfigurationKeyFirst = false;
        }, 500);
      },
      (error) => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log("error :",error);
      }
    );
  }

  applyOldFilter(filterType: any, list: any, oldList: any) {
    let filterValue: any = [];
    filterType = JSON.parse(filterType);
    for (let i = 0; i < list.length; i++) {
      let index = filterType.indexOf(list[i]);
      if (index == -1) {
        filterValue.push(list[i]);
      }
    }
    return filterValue;
  }

  reportCycleChange(event: any) {
    if (!this.isreportCycleFirst) {
      if (event.source.value == "All") {
        this.isreportCycleFirst = true;
        if (event.source._selected) {
          this.reportCycleData.setValue(this.reportCycleList);
          localStorage.setItem("sabFilterReportCycle", JSON.stringify([]));
        } else {
          this.reportCycleData.setValue([]);
          localStorage.setItem(
            "sabFilterReportCycle",
            JSON.stringify(this.reportCycleList)
          );
        }
        this.isreportCycleFirst = false;
      } else {
        this.isreportCycleFirst = true;
        let filter: any = localStorage.getItem("sabFilterReportCycle");

        if (!event.source._selected) {
          setTimeout(() => {
            this.isreportCycleFirst = true;

            if (this.reportCycleData.value[0] == "All") {
              let data = [...this.reportCycleData.value];
              data.splice(0, 1);
              this.reportCycleData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter);
              filter = [...filter, event.source.value];
              localStorage.setItem(
                "sabFilterReportCycle",
                JSON.stringify(filter)
              );
            } else {
              localStorage.setItem(
                "sabFilterReportCycle",
                JSON.stringify(["All", event.source.value])
              );
            }
            this.isreportCycleFirst = false;
          }, 300);
        } else {
          if (filter) {
            setTimeout(() => {
              this.isreportCycleFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1);
              localStorage.setItem(
                "sabFilterReportCycle",
                JSON.stringify(filter)
              );
              if (
                this.reportCycleData.value.length + 1 ==
                this.reportCycleList.length
              ) {
                this.isreportCycleFirst = true;
                this.reportCycleData.setValue(this.reportCycleList);
                localStorage.setItem(
                  "sabFilterReportCycle",
                  JSON.stringify([])
                );
                this.isreportCycleFirst = false;
              }
              this.isreportCycleFirst = false;
            }, 300);
          }
        }
        this.isreportCycleFirst = false;
      }
      this.updateDataSource();
    }
  }

  obsCategoryChange(event: any) {
    if (!this.isobsCategoryFirst) {
      if (event.source.value == "All") {
        this.isobsCategoryFirst = true;
        if (event.source._selected) {
          this.obsCategoryData.setValue(this.obsCategoryList);
          localStorage.setItem("sabFilterObsCategory", JSON.stringify([]));
        } else {
          this.obsCategoryData.setValue([]);
          localStorage.setItem(
            "sabFilterObsCategory",
            JSON.stringify(this.obsCategoryList)
          );
        }
        this.isobsCategoryFirst = false;
      } else {
        this.isobsCategoryFirst = true;
        let filter: any = localStorage.getItem("sabFilterObsCategory");

        if (!event.source._selected) {
          setTimeout(() => {
            this.isobsCategoryFirst = true;

            if (this.obsCategoryData.value[0] == "All") {
              let data = [...this.obsCategoryData.value];
              data.splice(0, 1);
              this.obsCategoryData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter);
              filter = [...filter, event.source.value];
              localStorage.setItem(
                "sabFilterObsCategory",
                JSON.stringify(filter)
              );
            } else {
              localStorage.setItem(
                "sabFilterObsCategory",
                JSON.stringify(["All", event.source.value])
              );
            }
            this.isobsCategoryFirst = false;
          }, 300);
        } else {
          if (filter) {
            setTimeout(() => {
              this.isobsCategoryFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1);
              localStorage.setItem(
                "sabFilterObsCategory",
                JSON.stringify(filter)
              );
              if (
                this.obsCategoryData.value.length + 1 ==
                this.obsCategoryList.length
              ) {
                this.isobsCategoryFirst = true;
                this.obsCategoryData.setValue(this.obsCategoryList);
                localStorage.setItem(
                  "sabFilterObsCategory",
                  JSON.stringify([])
                );
                this.isobsCategoryFirst = false;
              }
              this.isobsCategoryFirst = false;
            }, 300);
          }
        }
      }
      this.updateDataSource();
    }
  }

  configurationKeyChange(event: any) {
    if (!this.isconfigurationKeyFirst) {
      if (event.source.value == "All") {
        this.isconfigurationKeyFirst = true;
        if (event.source._selected) {
          this.configurationKeyData.setValue(this.configurationKeyList);
          localStorage.setItem("sabFilterConfigurationKey", JSON.stringify([]));
        } else {
          this.configurationKeyData.setValue([]);
          localStorage.setItem(
            "sabFilterConfigurationKey",
            JSON.stringify(this.configurationKeyList)
          );
        }
        this.isconfigurationKeyFirst = false;
      } else {
        this.isconfigurationKeyFirst = true;
        let filter: any = localStorage.getItem("sabFilterConfigurationKey");

        if (!event.source._selected) {
          setTimeout(() => {
            this.isconfigurationKeyFirst = true;

            if (this.configurationKeyData.value[0] == "All") {
              let data = [...this.configurationKeyData.value];
              data.splice(0, 1);
              this.configurationKeyData.setValue(data);
            }

            if (filter && JSON.parse(filter).length > 0) {
              filter = JSON.parse(filter);
              filter = [...filter, event.source.value];
              localStorage.setItem(
                "sabFilterConfigurationKey",
                JSON.stringify(filter)
              );
            } else {
              localStorage.setItem(
                "sabFilterConfigurationKey",
                JSON.stringify(["All", event.source.value])
              );
            }
            this.isconfigurationKeyFirst = false;
          }, 300);
        } else {
          if (filter) {
            setTimeout(() => {
              this.isconfigurationKeyFirst = true;
              filter = JSON.parse(filter);
              let index = filter.indexOf(event.source.value);
              filter.splice(index, 1);
              localStorage.setItem(
                "sabFilterConfigurationKey",
                JSON.stringify(filter)
              );
              if (
                this.configurationKeyData.value.length + 1 ==
                this.configurationKeyList.length
              ) {
                this.isobsCategoryFirst = true;
                this.configurationKeyData.setValue(this.configurationKeyList);
                localStorage.setItem(
                  "sabFilterConfigurationKey",
                  JSON.stringify([])
                );
                this.isconfigurationKeyFirst = false;
              }
              this.isconfigurationKeyFirst = false;
            }, 300);
          }
        }
      }
      this.updateDataSource();
    }
  }

  updateDataSource() {
    setTimeout(() => {
      let reportCycle: any[] = [];
      let obsCategory: any[] = [];
      let configurationKey: any[] = [];
      
      
      this.reportCycleData.value.map((reportCycleData: any) => {
        this.EscalationData.map((data: any) => {
          if (reportCycleData != "All") {
            if (reportCycleData == data.reportCycle) {
              reportCycle.push(data);
            }
          }
        });
      });
      this.obsCategoryData.value.map((obsCategoryData: any) => {
        reportCycle.map((data: any) => {
          if (obsCategoryData != "All") {
            if (obsCategoryData == data.obsCategory) {
              obsCategory.push(data);
            }
          }
        });
      });
      
      this.configurationKeyData.value.map((configurationKeyData: any) => {
        obsCategory.map((data: any) => {
          if (configurationKeyData != "All") {
            if (configurationKeyData == data.configurationKey) {
              configurationKey.push(data);
            }
          }
        });
      });
      this.dataSource.data = configurationKey;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    }, 300);
  }
  updateEscalation(data: any) {
    let url = "settingsController/updateEscalationSettingList";
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe(
      (Response) => {
        // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
        this.notification.create(
          "success",
          "Success",
          "Escalation Settings Configuration value has been updated successfully"
        );
        this.router.navigate(["/escalation-settings"]);
      },
      (error) => {
        // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
        console.log("err  :", error);
      }
    );
  }
  checkIsEscalationEnabled() {
		let url = 'settingsController/isEscalationEnabled';

		this._loading.setLoading(true, url);
		this.coreService.get(url).subscribe(Response => {
			this.isEscalationEnabled = Response;
			this._loading.setLoading(false, url);			
		}, error => {
			// this.isDialogLoading = false;
			this._loading.setLoading(false, url);
			console.log('err  :', error);
		})
	}
}

