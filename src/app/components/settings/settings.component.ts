import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CoreService } from 'src/app/services/core.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
}

export interface ObservationSettingData {
  year: string;
  letter: string;
  obsClassification: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isRtl: any;
  years: Years[] = [];
  selectedYear: string;
  dataSource: MatTableDataSource<ObservationSettingData>;
  displayedColumns: string[] = ['year', 'letter', 'obsClassification'];
  displayedColumnsMob: string[] = ['year', 'letter'];
  observationSettingData: ObservationSettingData[] = [
    {
      "year": "",
      "letter": "A",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "B",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "BD",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "C",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "CD",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "E",
      "obsClassification": ""
    }, {
      "year": "",
      "letter": "ED",
      "obsClassification": ""
    }
  ]
  isLoading: boolean;
  userInformation: any;
  reportYear: any;
  loginId:any
  isSelectedCurrentYear: boolean;
  classificationSettings: any;

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.reportYear = this.userInformation.reportYear;
    this.loginId = localStorage.getItem('loginId') || '';

    this.getReportYear();
  }

  getReportYear() {
    this.isLoading = true;
    let url = 'uploadReportController/getReportYears';
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      this.selectedYear = this.years[0].value;
      if (this.reportYear == this.selectedYear) {
        this.isSelectedCurrentYear = true;
      } else {
        this.isSelectedCurrentYear = false;
      }
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
    });
  }

  getSettingInfo() {
    this.isLoading = true;
    if (this.reportYear == this.selectedYear) {
      this.isSelectedCurrentYear = true;
    } else {
      this.isSelectedCurrentYear = false;
    }
    let url = 'settingsController/searchClassificationSetting?reportYear=' + this.selectedYear;
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this.classificationSettings = response;
      this.observationSettingData.map(data => {
        data.year = this.selectedYear;
        if (data.letter == 'A') {
          data.obsClassification = response.aValue;
        } else if (data.letter == 'B') {
          data.obsClassification = response.bValue;
        } else if (data.letter == 'BD') {
          data.obsClassification = response.bdValue;
        } else if (data.letter == 'C') {
          data.obsClassification = response.cValue;
        } else if (data.letter == 'CD') {
          data.obsClassification = response.cdValue;
        } else if (data.letter == 'E') {
          data.obsClassification = response.eValue;
        } else {
          data.obsClassification = response.edValue;
        }
      })
      this.dataSource = new MatTableDataSource(this.observationSettingData);
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
    });
  }

  updateSettingInfo() {
    this.isLoading = true;
    this.dataSource.data.map(data => {
      if (data.letter == 'A') {
        this.classificationSettings.aValue = data.obsClassification;
      } else if (data.letter == 'B') {
        this.classificationSettings.bValue = data.obsClassification;
      } else if (data.letter == 'BD') {
        this.classificationSettings.bdValue = data.obsClassification;
      } else if (data.letter == 'C') {
        this.classificationSettings.cValue = data.obsClassification;
      } else if (data.letter == 'CD') {
        this.classificationSettings.cdValue = data.obsClassification;
      } else if (data.letter == 'E') {
        this.classificationSettings.eValue = data.obsClassification;
      } else {
        this.classificationSettings.edValue = data.obsClassification;
      }
    })
    let url = 'settingsController/updateClassificationSetting';
    this.coreService.post(url, this.classificationSettings).subscribe(response => {
      this.isLoading = false;
      this.notification.create('success', 'Success', "Observation classification updated successfully");
    }, error => {
      this.isLoading = false;
      console.log('error :' , error);
      this.notification.create('error', 'Error', error);
    });
  }
}
