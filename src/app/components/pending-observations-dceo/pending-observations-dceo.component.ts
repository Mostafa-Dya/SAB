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



export interface UserListData{
  deptName: string;
  pendingManager: string;
  pendingTl:string;
  pendingUser: string; 
}


let ELEMENT_DATA:  UserListData[] = [];

@Component({
  selector: 'app-pending-observations-dceo',
  templateUrl: './pending-observations-dceo.component.html',
  styleUrls: ['./pending-observations-dceo.component.css']
})
export class PendingObservationsDCEOComponent implements OnInit {
 
  data = ELEMENT_DATA;
  public dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['deptName', 'pendingManager','pendingTl','pendingUser'];
  isRtl: any;
  isLoading: boolean = true; 
  _alldata: any;
  mainUrl: string;
  day:string;
  date:string;
  time:string;
  sabUserInformation: any;
  selectedDelegateUserInfo : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
  ) {
    this.mainUrl = this.configService.baseUrl;
  }

  ngOnInit(): void {
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    let data: any = localStorage.getItem('sabUserInformation');
    this.sabUserInformation = JSON.parse(data);
    let date = new Date();    
    this.day =  moment(date).format('dddd');
    this.date = moment(date).format('DD:MM:YYYY');
    this.time = moment(date).format('hh:mm:ss')

    this.getPendingItemsReportForDCEO();
  
  }

  getPendingItemsReportForDCEO(){
    this.isLoading = true;
    let url = 'SearchController/getPendingItemsReportForDCEO?userLogin=' + this.sabUserInformation.sabMember.loginId + '&userJobTitle='+ this.sabUserInformation.sabMember.userJobTitle;
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {
      if (this.sabUserInformation.sabMember.userJobTitle == 'SEC') {
        url = url +  '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      // let response  = {"dirCode":101330,"dirName":"Deputy C.E.O. For Planning & Finance","total":3,"deps":{"Corporate Planning":{"deptCode":103010,"deptName":"Corporate Planning","pendingUser":1,"pendingManager":2,"pendingTl":0},"Manufacturing Optimization Group ( MOG )":{"deptCode":180200,"deptName":"Manufacturing Optimization Group ( MOG )","pendingUser":0,"pendingManager":0,"pendingTl":0},"Finance":{"deptCode":113100,"deptName":"Finance","pendingUser":0,"pendingManager":0,"pendingTl":0},"General Manager KAFCO":{"deptCode":101210,"deptName":"General Manager KAFCO","pendingUser":0,"pendingManager":0,"pendingTl":0}}};
      let res:any = response.deps;
      Object.keys(res).forEach((key) => {
        this.data.push(res[key])
      })    
      this._alldata = response; 
      this.dataSource =  new MatTableDataSource(this.data);
      setTimeout(()=>{
        this.dataSource.paginator = this.paginator;
     
      },200)
    
   
    },
      error => {
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
  }
 

  exportMSWord(){
    let url = 'ReminderAndClassificationExportController/exportPendingItemsReportForDCEO?userLogin=' + this.sabUserInformation.sabMember.loginId + '&userJobTitle='+ this.sabUserInformation.sabMember.userJobTitle;
    if (this.selectedDelegateUserInfo) {
      url = url + '&isDelegatedUser=true&onBehalfOf=' + this.selectedDelegateUserInfo.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    } else {

      if (this.sabUserInformation.sabMember.userJobTitle == 'SEC') {
        url = url +  '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.supervisorDetails.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
      } else {
        url = url  + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);;
      }
      // url = url + '&isDelegatedUser=false&onBehalfOf=' + this.sabUserInformation.sabMember.loginId + '&r=' + (Math.floor(Math.random() * 100) + 100);
    }
    window.open(this.mainUrl + url, '_parent');
  }

  
}
