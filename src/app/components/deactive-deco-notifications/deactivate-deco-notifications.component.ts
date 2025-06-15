import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CoreService } from "src/app/services/core.service";
import { LoadingService } from "src/app/services/loading.service";
import { SharedVariableService } from "src/app/services/shared-variable.service";
import { MatDialog } from "@angular/material/dialog";

export interface EscalationData {
  userName: string;
  loginId: string;
  userTitle: string;
  departmentName:string;
  departmentCode:number;
  directorateName:string;
  directorateCode:number;
  regMailDisabled: boolean;
  esclatnMailDisabled: boolean;
}

@Component({
  selector: "app-deactivate-deco-notifications",
  templateUrl: "./deactivate-deco-notifications.component.html",
  styleUrls: ["./deactivate-deco-notifications.component.css"],
})
export class DeactivateDECONotificationsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] =["userName",  "loginId",  "departmetName",  "userJobTitle",  "regMailDisabled",  "esclatnMailDisabled",];
  isEscalationEnabled = true;
  displayedColumnsMob: string[] = ["userName",  "loginId",  "departmetName", "userJobTitle", "regMailDisabled",  "esclatnMailDisabled",];
  @ViewChild(MatSort) sort: MatSort;
  // ?=========================
  isLoading: boolean = false;
  EscalationData: EscalationData[];
  conceredMember:any =[]

  constructor(
    private router: Router,
    private coreService: CoreService,
    public dialog: MatDialog,
    private notification: NzNotificationService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.getDeactiveDECONotifications();
  }
  getDeactiveDECONotifications1() {
    let response = [
      {
          "loginId": "ECMTEST_DCEOAC",
          "userName": "DCEO Admin and Commercial",
          "userTitle": "Deputy C.E.O. For Admin. & Commercial",
          "departmentName": "Deputy C.E.O. For Admin. & Commercial",
          "departmentCode": 101320,
          "directorateName": "Deputy C.E.O. For Admin. & Commercial",
          "directorateCode": 101320,
          "divisionCode": 101320,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOFSO",
          "userName": "DCEO Fuel Supply Operations",
          "userTitle": "Deputy C.E.O. For Fuel Supply Operations",
          "departmentName": "Deputy C.E.O. Fuel Supply Operations",
          "departmentCode": 101210,
          "directorateName": "Deputy C.E.O. For Fuel Supply Operations",
          "directorateCode": 101210,
          "divisionCode": 101210,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOMAA",
          "userName": "DCEO MAA Refinery",
          "userTitle": "Deputy C.E.O. For MAA Ref.",
          "departmentName": "Deputy C.E.O. For MAA Ref.",
          "departmentCode": 101240,
          "directorateName": "Deputy C.E.O. For MAA Ref.",
          "directorateCode": 101240,
          "divisionCode": 101240,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOMAB",
          "userName": "DCEO MAB Refinery",
          "userTitle": "Deputy C.E.O. For MAB Ref.",
          "departmentName": "Deputy C.E.O. For MAB Ref.",
          "departmentCode": 101230,
          "directorateName": "Deputy C.E.O. For MAB Ref.",
          "directorateCode": 101230,
          "divisionCode": 101230,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOPF",
          "userName": "DCEO Planning and Finance",
          "userTitle": "Deputy C.E.O. For Planning & Finance",
          "departmentName": "Deputy C.E.O. For Planning & Finance",
          "departmentCode": 101330,
          "directorateName": "Deputy C.E.O. For Planning & Finance",
          "directorateCode": 101330,
          "divisionCode": 101330,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOP",
          "userName": "DCEO Projects",
          "userTitle": "Deputy C.E.O. For Projects",
          "departmentName": "Deputy C.E.O. For Projects",
          "departmentCode": 101270,
          "directorateName": "Deputy C.E.O. For Projects",
          "directorateCode": 101270,
          "divisionCode": 101270,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_DCEOSS",
          "userName": "DCEO Support Services",
          "userTitle": "Deputy C.E.O. For Support Services",
          "departmentName": "Deputy C.E.O. For Support Services",
          "departmentCode": 101280,
          "directorateName": "Deputy C.E.O. For Support Services",
          "directorateCode": 101280,
          "divisionCode": 101280,
          "supervisorLogin": "ECMTest_CEO",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "DCEO",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      }
  ];
  
    this.dataSource = new MatTableDataSource(response);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
   
  }
  getDeactiveDECONotifications() {
    // let response = [{"id":4,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":6,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":9,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":11,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":13,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":15,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":17,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":19,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":21,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":24,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":26,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":33,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":35,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":37,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":39,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":41,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":43,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":45,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":47,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"3"},{"id":49,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":51,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":1,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":5,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":8,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":10,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":12,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":14,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":16,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":18,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":20,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":22,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":25,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":32,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":34,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":36,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":38,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":40,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":42,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":44,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":46,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"7"},{"id":48,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"},{"id":50,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"}];
     let url = "UserController/getAllDCEOS";
     this.isLoading = true;
     this._loading.setLoading(true, url);
     this.coreService.get(url).subscribe(
      response=> {
        this.isLoading = false;
         this._loading.setLoading(false, url); 
     
        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
       },
       (error) => {
        this.isLoading = false;
         this._loading.setLoading(false, url);
         console.log("error :",error);
       }
     );
  }

  updateNotification(data: any) {
    console.log(data)
     let url = 'UserController/updateUserMailSettings?loginId='+data.loginId+'&isRegMailDisabled='+data.regMailDisabled+'&isEscltnMailDisabled='+data.esclatnMailDisabled;
     this._loading.setLoading(true, url);
     this.coreService.get(url).subscribe(
       (Response) => {
    //     // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
         
    this.notification.create('success', 'Success', "Email notification activation status updated successfully.");
         //this.router.navigate(["/deactivate-deco-notifications"]);
         this.getDeactiveDECONotifications();
      },
      (error) => {
    //     // this.isDialogLoading = false;
         this._loading.setLoading(false, url);
         this.notification.create('error', 'error', "Failed to update.");
    //     console.log("err  :", error);
      }
    );
  }


}

