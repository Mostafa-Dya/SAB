import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

export interface ObservationSettingsData {
  obsId: number
  obsTitle: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-observation-settings',
  templateUrl: './observation-settings.component.html',
  styleUrls: ['./observation-settings.component.css']
})
export class ObservationSettingsComponent implements OnInit {
  dataSource: MatTableDataSource<ObservationSettingsData>;
  displayedColumnsRTL: string[] = ['action','obsSequence','obsType', 'obsTitle', 'view'];
  displayedColumns: string[] = ['view', 'obsTitle', 'obsType','obsSequence','action'];
  displayedColumnsMob: string[] = ['obsTitle'];
  isRtl: any;
	userInformation: any;
  reportYear: any;
  loginId: any;
  userName: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedItem:any = [];
  obsType = ''
  selection = new SelectionModel<any>(true, []);

  // observationSettingsData: ObservationSettingsData[] = [
  //   {
  //     "obsId": 1,
  //     "obsTitle": "أولا: \tOBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:"
  //   }, {
  //     "obsId": 2,
  //     "obsTitle": "2- OBI2استمرار الملاحظات المتعلقة بالعقود الاستشارية الخاصة بتمويل مشروع للوقود البيئي:"
  //   }, {
  //     "obsId": 3,
  //     "obsTitle": "   3- \tOBI3الملاحظات التي شابت العقد الاستشاري الرئيسي لمشروع الوقود البيئيOB3:"
  //   }
  // ]

  constructor(
    public dialog: MatDialog,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });

    let userData: any = localStorage.getItem('sabUserInformation');
		this.userInformation = JSON.parse(userData);
    this.loginId = localStorage.getItem('loginId') || '';
    this.getObservationSettings();
    // this.dataSource = new MatTableDataSource(this.observationSettingsData);
  }


  getObservationSettings() {
    let url = 'settingsController/searchObservationSetting?reportYear=' + this.userInformation.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.dataSource = new MatTableDataSource(response: any);
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
    this.router.navigate(['observation-settings/edit-observation', row.obsId]);
  }
  selectionChange(event:any,selectedItem:any){
    // this.selectedItem = [];
    // for (let i = 0; i < this.dataSource.data.length; i++) {
    //   if(this.dataSource.data[i].isSelected){
    //     this.selectedItem.push( this.dataSource.data[i])
    //   }
    // }
    // console.log(selectedItem,event)
    if(event.checked){
      this.selectedItem.push(selectedItem)
    }else{
      this.selectedItem = this.selectedItem.filter((val:any)=>val.obsId != selectedItem.obsId);
    }

    if(!this.selectedItem.length){
      this.obsType = ""
    }
    
  }


  changeObservationType(obsType:any) {
      this.obsType = obsType
  }
  updateObjType(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'Update New/Repeated',
        dialogMessage: 'ARE_YOU_SURE_UPDATE_OBSERVATION_TYPE',
        type: this.obsType
      }
    });
    dialogRef.afterClosed().subscribe((result:any )=> {
      if (result) {
        this._updateObjType();
      }
    });
  }
  _updateObjType(){
    let obsId = this.selectedItem.map((item: any) => item.obsId).join(',');

    let url = `settingsController/updateObsSettingsObsType?reportYear=${this.userInformation.reportYear}&obsIds=${obsId}&obsType=${this.obsType}`;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.obsType = '';
      this.selectedItem = []
      this.getObservationSettings();
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }
}
