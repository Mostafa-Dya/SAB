import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatMenuTrigger} from '@angular/material/menu';
import * as moment from 'moment';
import { MatAccordion } from '@angular/material/expansion';



export interface committeeData{
  department: string;
  pendingResponse: number;
  pendingApproval:number;
}

export interface dceoData{
  deptName: string;
  pendingManager: string;
  pendingTl:string;
  pendingUser: string; 
}


let ELEMENT_DATA:  committeeData[] = [   
  {"department" : "CEO" ,"pendingResponse":0,"pendingApproval":0},
  {"department" : "DCEO" ,"pendingResponse":0,"pendingApproval":0},
 
  {"department" : "Manager" ,"pendingResponse":0,"pendingApproval":0},
  {"department" : "TL" ,"pendingResponse":0,"pendingApproval":0},
  
];

@Component({
  selector: 'app-pending-observations-report',
  templateUrl: './pending-observations-report.component.html',
  styleUrls: ['./pending-observations-report.component.scss']
})
export class PendingObservationsReportComponent implements OnInit {
 
  data = ELEMENT_DATA;
  public dataSource = new MatTableDataSource<any>([]);
  _alldata: any[];
  displayedColumns: string[] = ['department', 'pendingResponse','pendingApproval'];

  displayedColumnsForDCEO: string[] = ['deptName', 'pendingManager','pendingTl','pendingUser'];
  public dataSourceForDCEO = new MatTableDataSource<any>([]);
  _alldataForDCEO: any;
  dataForDCEO :dceoData[] = []
  isRtl: any;
  isLoading: boolean = true; 
  mainUrl: string;
  day:string;
  date:string;
  time:string;
  sabUserInformation: any;
  selectedDelegateUserInfo : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  committiTotal = 0;
  observationReport :any ;
  observationReportData :any[] =[];
  loginId:any =''
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
  ) {
    
    this.mainUrl = this.configService.baseUrl;
  }
  panelOpenState = false;

  ngOnInit(): void {
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.loginId = localStorage.getItem('loginId') || '';
    let data: any = localStorage.getItem('sabUserInformation');
    this.sabUserInformation = JSON.parse(data);
    let date = new Date();    
    this.day =  moment(date).format('dddd');
    this.date = moment(date).format('DD:MM:YYYY');
    this.time = moment(date).format('hh:mm:ss')
    this.getPendingItemsReportForDCEO();
    this.getPendingCommitteObservations(); 
  }


  getPendingItemsReportForDCEO(){
    this.isLoading = true;
    let url = 'SearchController/getPendingItemsReportForDCEO?userLogin=' + this.sabUserInformation.sabMember.loginId + 
    '&userJobTitle='+ this.sabUserInformation.sabMember.userJobTitle +'&reportYear=' + this.sabUserInformation.reportYear 
    +'&reportCycle=' + encodeURI( this.sabUserInformation.reportCycle);
    
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember == 'SEC') {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
        
      // let response:any  = {"Deputy C.E.O. For Planning & Finance":{"dirCode":101330,"dirName":"Deputy C.E.O. For Planning & Finance","total":1,"deps":{"Corporate Planning":{"deptCode":103010,"deptName":"Corporate Planning","pendingUser":0,"pendingManager":1,"pendingTl":0,"count":0}}}};
      // let response = this.observationReport
      // for(let i = 0 ;i< response.length ;i++){
        Object.keys(response).forEach((key:any,i:number) => {
        this.observationReportData.push({
          "departmentData":[],
          "dirCode": response[key].dirCode,
          "dirName": response[key].dirName,
          "total": response[key].total,
        })
        let res:any = response[key].deps;
        let dataForDCEO : any = [];
        Object.keys(res).forEach((key) => {
          dataForDCEO.push(res[key])
        })    
        this.observationReportData[i].departmentData =  new MatTableDataSource(dataForDCEO);
      // }
    }) 
  
    },
      error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
  }
 
  getPendingCommitteObservations(){
    this.isLoading = true;
    let url = 'InProgController/getPendingCommitteObservations?userLogin=' + this.sabUserInformation.sabMember.loginId + 
    '&userJobTitle='+ this.sabUserInformation.sabMember.userJobTitle + 
    '&departmentCode='+ this.sabUserInformation.sabMember.departmentCode;
    
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember == 'SEC') {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url +  '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      // let response = {"ceoFormatterObs":0,"ceoHeaderObs":0,"dceoFormatterObs":0,"dceoHeaderObs":1,"mgrFormatterObs":0,"mgrHeaderObs":1,"tlFormatterObs":0,"tlHeaderObs":0}
      this.data[0].pendingResponse = response.ceoHeaderObs
      this.data[0].pendingApproval = response.ceoFormatterObs
      this.data[1].pendingResponse = response.dceoHeaderObs
      this.data[1].pendingApproval = response.dceoFormatterObs
      this.data[2].pendingResponse = response.mgrHeaderObs
      this.data[2].pendingApproval = response.mgrFormatterObs
      this.data[3].pendingResponse = response.tlHeaderObs
      this.data[3].pendingApproval = response.tlFormatterObs

      this._alldata = this.data; 
      this.dataSource =  new MatTableDataSource(this._alldata);

      this.committiTotal = response.ceoFormatterObs + response.ceoHeaderObs + response.dceoFormatterObs + response.dceoHeaderObs + response.mgrFormatterObs + response.mgrHeaderObs  + response.tlFormatterObs  + response.tlHeaderObs

   
    },
      error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
  }

  exportMSWordForDCEO(){
    let url = 'ReminderAndClassificationExportController/exportPendingItemsReportForDCEO?userLogin=' + this.sabUserInformation.sabMember.loginId + '&userJobTitle='+ this.sabUserInformation.sabMember.userJobTitle  +'&reportYear=' + this.sabUserInformation.reportYear +'&reportCycle=' + this.sabUserInformation.reportCycle;;
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {

      if (this.sabUserInformation.sabMember == 'SEC') {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    window.open(this.mainUrl + url, '_parent');
  }

  exportMSExcel(){
    let url = '' ;
    window.open(this.mainUrl + url, '_parent');
  }
  exportMSWord(){
    let url = '';
    window.open(this.mainUrl + url, '_parent');
  }

  
}
