import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CoreService } from "src/app/services/core.service";
import { LoadingService } from "src/app/services/loading.service";
import { SharedVariableService } from "src/app/services/shared-variable.service";
import { MatDialog } from "@angular/material/dialog";
import { GPAMemberDetailsComponent } from "../g&pa-member-details/g&pa-member-details.component";

export interface EscalationData {
  configurationKey: string;
  configurationValue: string;
  obsCategory: string;
  id: number;
  reportCycle: string;
}

@Component({
  selector: "app-g&pa-contact-details",
  templateUrl: "./g&pa-contact-details.component.html",
  styleUrls: ["./g&pa-contact-details.component.scss"],
})
export class GPAContactDetailsComponent implements OnInit {
  isRtl: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "department",
    "concernedMember",
  ];
  isEscalationEnabled = true;
  displayedColumnsMob: string[] = ["department","concernedMember"];
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // ?=========================
  isLoading: boolean = false;
  EscalationData: EscalationData[];
  conceredMembers:any =[]

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
    this.getContactDetails();
    this.getGpaMembers();
    //this.getConceredMember();
  }

/** 
  getConceredMember(){
    // let url = "settingsController/conceredMember";
    // this.isLoading = true;
    // this._loading.setLoading(true, url);
    // this.coreService.get(url).subscribe(
    //   async (response) => {
    //     this.isLoading = false;
    //     this._loading.setLoading(false, url); 
      let response:any = [{
        concernedMember:'Khaled Nayef Aldabbous'        
      },{
        concernedMember:'Shaika Salah Ahmad Alwehaib'        
      },{
        concernedMember:'Reem Ahmad Jassim Almehaib '        
      },{
        concernedMember:'Reem Ahmad Jassim Almnaies'        
      },{
        concernedMember:'Nour Alhuda Yaser'        
      }]
      this.conceredMember = response
    //   },
    //   (error) => {
    //     this.isLoading = false;
    //     this._loading.setLoading(false, url);
    //     console.log("error :",error);
    //   }
    // );
  }
**/
  getContactDetails() {
    // let response = [{"id":4,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":6,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":9,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"Reminder","configurationValue":"2"},{"id":11,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":13,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":15,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"Reminder","configurationValue":"2"},{"id":17,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":19,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":21,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"Reminder","configurationValue":"2"},{"id":24,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":26,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":33,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"Reminder","configurationValue":"2"},{"id":35,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":37,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":39,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"Reminder","configurationValue":"2"},{"id":41,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":43,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":45,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"Reminder","configurationValue":"2"},{"id":47,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"3"},{"id":49,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":51,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"Reminder","configurationValue":"2"},{"id":1,"obsCategory":"Normal","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":5,"obsCategory":"Special Nature","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":8,"obsCategory":"Committee","reportCycle":"KNPC Response Report","configurationKey":"CallDate","configurationValue":"5"},{"id":10,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":12,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":14,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q1","configurationKey":"CallDate","configurationValue":"5"},{"id":16,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":18,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":20,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q2","configurationKey":"CallDate","configurationValue":"5"},{"id":22,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":25,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":32,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q3","configurationKey":"CallDate","configurationValue":"5"},{"id":34,"obsCategory":"Normal","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":36,"obsCategory":"Special Nature","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":38,"obsCategory":"Committee","reportCycle":"SAB Quarterly Report Q4","configurationKey":"CallDate","configurationValue":"5"},{"id":40,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":42,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":44,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 1","configurationKey":"CallDate","configurationValue":"5"},{"id":46,"obsCategory":"Normal","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"7"},{"id":48,"obsCategory":"Special Nature","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"},{"id":50,"obsCategory":"Committee","reportCycle":"SAB Semi-annual Report 2","configurationKey":"CallDate","configurationValue":"5"}];
    /** 
   let response = [
    {
        "directorateName": "Deputy C.E.O. For Planning & Finance\r\n",
        "directorateCode": 101330,
        "departmentCode": 103010,
        "departmentName": "Corporate Planning\r\n",
        "loginId": "ECMTEST_MSD_ENG",
        "loginName": "Government & Parliament Affairs Engineer"
    },
    {
        "directorateName": "Deputy C.E.O. For Support Services\r\n",
        "directorateCode": 101280,
        "departmentCode": 196100,
        "departmentName": "Information Technology\r\n",
        "loginId": "ECMTEST_MSD_SRENG",
        "loginName": "Government & Parliament Affairs Senior Engineer"
    },
    {
        "directorateName": "Deputy C.E.O. For Admin. & Commercial\r\n",
        "directorateCode": 101320,
        "departmentCode": 104100,
        "departmentName": "Commercial\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Support Services\r\n",
        "directorateCode": 101280,
        "departmentCode": 108110,
        "departmentName": "Corporate Communication\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Chief Executive Officer's Office\r\n",
        "directorateCode": 101010,
        "departmentCode": 102010,
        "departmentName": "Corporate Legal\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Planning & Finance\r\n",
        "directorateCode": 101330,
        "departmentCode": 113100,
        "departmentName": "Finance\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 410100,
        "departmentName": "Gas Operations - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Support Services\r\n",
        "directorateCode": 101280,
        "departmentCode": 119100,
        "departmentName": "General Services\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Special Nature",
        "directorateCode": 555555,
        "departmentCode": 555555,
        "departmentName": "Special Nature",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Committee",
        "directorateCode": 777777,
        "departmentCode": 777777,
        "departmentName": "Committee",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. Fuel Supply Operations\r\n",
        "directorateCode": 101210,
        "departmentCode": 111010,
        "departmentName": "Risk Management\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Support Services\r\n",
        "directorateCode": 101280,
        "departmentCode": 151100,
        "departmentName": "Security & Fire\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 181000,
        "departmentName": "SHU\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 404010,
        "departmentName": "Technical Services - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 304010,
        "departmentName": "Technical Services - MAB\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Admin. & Commercial\r\n",
        "directorateCode": 101320,
        "departmentCode": 107200,
        "departmentName": "Training & Career Development\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Projects\r\n",
        "directorateCode": 101270,
        "departmentCode": 701010,
        "departmentName": "Projects  (CFP)\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Projects\r\n",
        "directorateCode": 101270,
        "departmentCode": 105500,
        "departmentName": "Projects I\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Projects\r\n",
        "directorateCode": 101270,
        "departmentCode": 801110,
        "departmentName": "Projects II\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 411010,
        "departmentName": "Quality Assurance - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 311010,
        "departmentName": "Quality Assurance - MAB\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Planning & Finance\r\n",
        "directorateCode": 101330,
        "departmentCode": 309100,
        "departmentName": "Research & Technology - MAB\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Admin. & Commercial\r\n",
        "directorateCode": 101320,
        "departmentCode": 110201,
        "departmentName": "Management Support\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Planning & Finance\r\n",
        "directorateCode": 101330,
        "departmentCode": 180200,
        "departmentName": "Manufacturing Optimization Group ( MOG )\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 302010,
        "departmentName": "Operations - MAB\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 405200,
        "departmentName": "Operations Clean Fuels - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 320100,
        "departmentName": "Operations Clean Fuels - MAB\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 402200,
        "departmentName": "Operations Refinery - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Support Services\r\n",
        "directorateCode": 101280,
        "departmentCode": 118100,
        "departmentName": "Health, Safety + Environment\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For Admin. & Commercial\r\n",
        "directorateCode": 101320,
        "departmentCode": 106300,
        "departmentName": "Human Resources\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. Fuel Supply Operations\r\n",
        "directorateCode": 101210,
        "departmentCode": 101210,
        "departmentName": "KAFCO\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. Fuel Supply Operations\r\n",
        "directorateCode": 101210,
        "departmentCode": 117010,
        "departmentName": "Local Marketing\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAA Ref.\r\n",
        "directorateCode": 101240,
        "departmentCode": 403310,
        "departmentName": "Maintenance - MAA\r\n",
        "loginId": "",
        "loginName": ""
    },
    {
        "directorateName": "Deputy C.E.O. For MAB Ref.\r\n",
        "directorateCode": 101230,
        "departmentCode": 303310,
        "departmentName": "Maintenance - MAB\r\n",
        "loginId": "",
        "loginName": ""
    }
]; 
this.dataSource = new MatTableDataSource(response); 
**/
    
    let url = "settingsController/getDepartmentContactList";
     this.isLoading = true;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async (response) => {
        this.isLoading = false;
        this._loading.setLoading(false, url); 
      
        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          //this.dataSource.paginator = this.paginator;
        });
      },
      (error) => {
        this.isLoading = false;
         this._loading.setLoading(false, url);
         console.log("error :",error);
       }
     );
     
  }

  updateConcernedMember(data: any) {
    
    let url = 'settingsController/updateContactInfo?deptCode='+data.departmentCode+'&dirctCode='+data.directorateCode+'&loginId='+data.loginId+'&deptName='+data.departmentName;
   //  let url = "settingsController/updateContactInfo";
     this._loading.setLoading(true, url);
     this.coreService.get(url).subscribe(response => {
    //     // this.isDialogLoading = false;
         this._loading.setLoading(false, url);
        
    this.notification.create('success', 'Success', "Concerned G&PA Member updated successfully.");
         this.router.navigate(["/g&pa-contact-details"]);
       },
       (error) => {
    //     // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
        console.log("err  :", error);
       }
     );
  }
  getGpaMembers(): void {
     /** 
    let response = 
    [
        {
            "loginId": "ECMTEST_MSD_ENG",
            "extensionNo": "8111",
            "userName": "Government & Parliament Affairs Engineer",
            "userTitle": "Eng, Government & Parliament Affairs",
            "departmentName": "Management Support",
            "departmentCode": 110201,
            "directorateName": "Deputy C.E.O. For Admin. & Commercial",
            "directorateCode": 101320,
            "divisionCode": 110270,
            "supervisorLogin": "ECMTEST_TL_MS_CHANGE",
            "userMail": "CRN899@knpc.com",
            "userJobTitle": "ENG",
            "regMailDisabled": false,
            "esclatnMailDisabled": false
        },
        {
            "loginId": "ECMTEST_MSD_SRENG",
            "extensionNo": "8223",
            "userName": "Government & Parliament Affairs Senior Engineer",
            "userTitle": "Sr. Engineer, Government & Parliament Affairs",
            "departmentName": "Management Support",
            "departmentCode": 110201,
            "directorateName": "Deputy C.E.O. For Admin. & Commercial",
            "directorateCode": 101320,
            "divisionCode": 110270,
            "supervisorLogin": "ECMTEST_TL_MS_CHANGE",
            "userMail": "MSD_GPA_SRENG@knpc.com",
            "userJobTitle": "SENG",
            "regMailDisabled": false,
            "esclatnMailDisabled": false
        },
        {
            "loginId": "ECMTEST_TL_MS_CHANGE",
            "extensionNo": "8444",
            "userName": "Team Lead Government & Parliament Affairs",
            "userTitle": "Team Lead, Government & Parliament Affairs",
            "departmentName": "Management Support",
            "departmentCode": 110201,
            "directorateName": "Deputy C.E.O. For Admin. & Commercial",
            "directorateCode": 101320,
            "divisionCode": 110270,
            "supervisorLogin": "ECMTEST_MGR_MS",
            "userMail": "MSD_GPA_TL@knpc.com",
            "userJobTitle": "TL",
            "regMailDisabled": false,
            "esclatnMailDisabled": false
        }
    ];
    this.conceredMembers = response;
    **/
    
     
    let url = 'UserController/getGPASabMembers';
    this.coreService.get(url).subscribe(response => {
      this.conceredMembers = response
     }, error => {
      console.log('error :', error);
     })
     
  }
  openGpaMemberDetails(): void {
    /** 
    let response = [
      {
          "loginId": "ECMTEST_MSD_ENG",
          "extensionNo": "8111",
          "userName": "Government & Parliament Affairs Engineer",
          "userTitle": "Eng, Government & Parliament Affairs",
          "departmentName": "Management Support",
          "departmentCode": 110201,
          "directorateName": "Deputy C.E.O. For Admin. & Commercial",
          "directorateCode": 101320,
          "divisionCode": 110270,
          "supervisorLogin": "ECMTEST_TL_MS_CHANGE",
          "userMail": "CRN899@knpc.com",
          "userJobTitle": "ENG",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_MSD_SRENG",
          "extensionNo": "8223",
          "userName": "Government & Parliament Affairs Senior Engineer",
          "userTitle": "Sr. Engineer, Government & Parliament Affairs",
          "departmentName": "Management Support",
          "departmentCode": 110201,
          "directorateName": "Deputy C.E.O. For Admin. & Commercial",
          "directorateCode": 101320,
          "divisionCode": 110270,
          "supervisorLogin": "ECMTEST_TL_MS_CHANGE",
          "userMail": "MSD_GPA_SRENG@knpc.com",
          "userJobTitle": "SENG",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      },
      {
          "loginId": "ECMTEST_TL_MS_CHANGE",
          "extensionNo": "8444",
          "userName": "Team Lead Government & Parliament Affairs",
          "userTitle": "Team Lead, Government & Parliament Affairs",
          "departmentName": "Management Support",
          "departmentCode": 110201,
          "directorateName": "Deputy C.E.O. For Admin. & Commercial",
          "directorateCode": 101320,
          "divisionCode": 110270,
          "supervisorLogin": "ECMTEST_MGR_MS",
          "userMail": "MSD_GPA_TL@knpc.com",
          "userJobTitle": "TL",
          "regMailDisabled": false,
          "esclatnMailDisabled": false
      }
  ];
    const dialogRef = this.dialog.open(GPAMemberDetailsComponent, {
      width: '800px',
      data: {
        dialogHeader: 'G&PA_MEMBER_DETAILS',
        dialogData: response 
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result.event == 'Send') {
        this.updateGPAMemberDetails(result);
      }
    });  
    **/

      
    let url = 'UserController/getGPASabMembers';
     this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
       this._loading.setLoading(false, url);
     
      const dialogRef = this.dialog.open(GPAMemberDetailsComponent, {
        width: '800px',
        data: {
          dialogHeader: 'G&PA_MEMBER_DETAILS',
          dialogData: response 
        }
      });
      dialogRef.afterClosed().subscribe((result:any) => {
        if (result.event == 'Send') {
          this.updateGPAMemberDetails(result);
        }
      });
     }, error => {
     
      this._loading.setLoading(false, url);
      console.log('error :', error);
     })
     
  }

  updateGPAMemberDetails(result: any): void {
    let _result =result.data.dialogData

    let url = 'UserController/updateUserExtn';
     this._loading.setLoading(true, url);
     this.coreService.post(url, _result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.notification.create('success', 'Success', "G&PA Member Details updated successfully.");
     }, error => {
      this._loading.setLoading(false, url);
       console.log('error  :', error);
     })
  }

}

