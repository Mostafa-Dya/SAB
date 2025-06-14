import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { isArray } from 'lodash';

export interface ClassificationData {
  value: string;
}

export interface Entities {
  name: string;
}

interface DateStrings {
  date: string;
}

interface Entitys {
  value: string;
  name: string;
}

export interface NatureType {
  value: string;
}

@Component({
  selector: 'app-edit-observation',
  templateUrl: './edit-observation.component.html',
  styleUrls: ['./edit-observation.component.scss']
})
export class EditObservationComponent implements OnInit {
  isRtl: any;
  obsId: any;
  obsSettingDetails: any;
  classificationData: ClassificationData[] = [
    { value: '' },
    { value: 'A' },
    { value: 'B' },
    { value: 'BD' },
    { value: 'C' },
    { value: 'CD' },
    { value: 'E' },
    { value: 'ED' },
  ];
  selectedClassification: string;
  natureType: NatureType[] = [
    { value: '' },
    { value: 'إجرائية' },
    { value: 'قانونية' },
    { value: 'مالية' },
    { value: 'بيئية' },
    { value: 'تعاقدية' },
    { value: 'فنية' },
    { value: 'طبيعة صناعة' },
    { value: 'اخرى' }
  ];
  selectedNature: string;
  otherNature: string = '';
  seriousNotesOptions = [
    { "value": "تم تسويتها" },
    { "value": "تم تسوية جزء منها" },
    { "value": "لم يتم تسويتها" },
  ]
  classification: string;
  govtEntity: string = '';
  date:string='';
  fiscaalYear: any[] = [];
  userInformation:any;
  dateStrings: DateStrings[] = [
    { date: 'متباين الرأى بشأنها' },
    { date: 'تتعلق بجهات حكومية/اخرى' },
    { date: 'تم الانتهاء من إجراءاتها'}
  ];
  isDateFieldSelected = true;
  selectedDateString: string;
  entities: any = [];
  constructor(
    private route: ActivatedRoute,
    private sharedVariableService: SharedVariableService,
    private coreService: CoreService,
    public dialog: MatDialog,
    private _loading: LoadingService,
    private notification: NzNotificationService
  ) { }

  async ngOnInit() {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.obsId = params['obsId'];
    });
    this.getObservationSettingDetails();

    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    let reportYear = this.userInformation.reportYear;
    reportYear = reportYear.split('-')[0];
    reportYear = Number(reportYear);

    this.fiscaalYear = await this.sharedVariableService.getYearsFromReport(reportYear)
    this.fiscaalYear = [...this.dateStrings, ...this.fiscaalYear]
  }

  addChip(entity: any) {
    if ((entity || '').trim()) {
      this.entities.push(entity.trim());
    }

    if (entity !== '') {
      this.govtEntity = '';
    }


  }

  remove(entities: Entities): void {
    const index = this.entities.indexOf(entities);

    if (index >= 0) {
      this.entities.splice(index, 1);
    }
  }

  getObservationSettingDetails() {
    let url = 'settingsController/observationSettingDetails?obsId=' + this.obsId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      if (response.completionYear) {
        this.date = response.completionYear;

        if (response.obsType == 'NEW') {
          if (response.completionYear == 'متباين الرأى بشأنها') {
            this.classification = 'C';
          } else if (response.completionYear == 'تتعلق بجهات حكومية/اخرى') {
            this.classification = 'E';
          }else if (response.completionYear == 'تم الانتهاء من إجراءاتها'){
            this.classification = 'A';
          }
        } else {
          if (response.completionYear == 'متباين الرأى بشأنها') {
            this.classification = 'CD';
          } else if (response.completionYear == 'تتعلق بجهات حكومية/اخرى') {
            this.classification = 'ED';
          } else if (response.completionYear == 'تم الانتهاء من إجراءاتها') {
            this.classification = 'A';
          }
        }
      }

      if(response.classification){
        this.classification =  response.classification;
      }

    
      if (response.govtEntity) {
        this.entities = response.govtEntity.split(',');
      }

      if (response.nature) {
        let isNatureMatched = false;
        if (this.natureType[0].value == '') {
          this.natureType = this.natureType.slice(1);
        }
        this.natureType.map((nature, index) => {
          if (nature.value == response.nature) {
            isNatureMatched = true;
            this.selectedNature = this.natureType[index].value;
          }
        });
        if (!isNatureMatched) {
          this.otherNature = response.nature;
          this.selectedNature = this.natureType[this.natureType.length - 1].value;
        }
      } else {
        this.selectedNature = this.natureType[0].value;
      }
      this.obsSettingDetails = response;
      // this.obsSettingDetails.reportToBeGenerated = 'KNPC Response Report1'
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  changeObservationType() {
    if (this.obsSettingDetails.obsType == "NEW") {
      this.obsSettingDetails.obsType = "REPEATED";
    } else {
      this.obsSettingDetails.obsType = "NEW";
    }
  }


  dateChange() {
    // if (this.isDateFieldSelected) {
    if (this.obsSettingDetails.obsType == 'NEW') {
      this.classification = 'B';
    } else {
      this.classification = 'BD';
    }
    // } else {
    if (this.obsSettingDetails.obsType == 'NEW') {
      if (this.date == 'متباين الرأى بشأنها') {
        this.classification = 'C';
      } else if (this.date == 'تتعلق بجهات حكومية/اخرى') {
        this.classification = 'E';
      } else if (this.date == 'تم الانتهاء من إجراءاتها')
      // else if (this.date == 'Completed') 
      {
        this.classification = 'A';
      }
    } else {
      if (this.date == 'متباين الرأى بشأنها') {
        this.classification = 'CD';
      } else if (this.date == 'تتعلق بجهات حكومية/اخرى') {
        this.classification = 'ED';
      }else if(this.date == 'تم الانتهاء من إجراءاتها')
      //  else if (this.date == 'Completed') 
       {
        this.classification = 'A';
      }
    }
    // }
  }

  onSubmit() {
    if(isArray(this.entities)){
      this.entities = this.entities.filter((item: any) => {
        return item.trim();
      })
    } 
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'EDIT_OBSERVATION',
        dialogMessage: 'ARE_YOU_SURE_EDIT_OBSERVATION'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
    let url = 'settingsController/updateObsSettingDetails';
    let nature = '';
    if (this.selectedNature == 'اخرى') {
      nature = this.otherNature;
    } else {
      nature = this.selectedNature;
    }
    let data = {
      obsId: this.obsId,
      obsTitle: this.obsSettingDetails.obsTitle,
      obsType: this.obsSettingDetails.obsType,
      // classification: this.selectedClassification,
      nature: nature,
      seriousNotes: this.obsSettingDetails.seriousNotes,
      reportToBeGenerated: this.obsSettingDetails.reportToBeGenerated,
      completionYear: this.date,
      classification: this.classification,
      govtEntity: this.date == 'تتعلق بجهات حكومية/اخرى' ? this.entities.join(', ') : '',
    }
    this._loading.setLoading(true, url);
    this.coreService.post(url, data).subscribe((response: any) => {
      this._loading.setLoading(false, url);
      this.notification.create('success', 'Success', response.message);
      this.getObservationSettingDetails();
    }, error => {
      this._loading.setLoading(false, url);
      this.notification.create('error', 'Error', error);
    })}
  })
  }

  checkSelected(value: string) {
    this.selectedDateString = value;

    if (value == 'متباين الرأى بشأنها') {
      this.isDateFieldSelected = false;
    } else {
      if (value == 'تتعلق بجهات حكومية/اخرى') {
        this.isDateFieldSelected = true;
      } else {
        if (value == 'تم الانتهاء من إجراءاتها'){
          this.isDateFieldSelected = false;
        } else {
          this.isDateFieldSelected = true;
        }
      }
    }
  }
}