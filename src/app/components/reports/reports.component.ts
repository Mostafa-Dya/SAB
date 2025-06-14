import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ConfigService } from 'src/app/services/config.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isRtl: any;
  userInformation: any;
  reportYear: any;
  userJobTitle: any;
  mainUrl: any;
  loginId: any;
  admin: any = false;
  reportToBeEnabled: any = undefined;
  row_1_report: any = [];
  row_2_report: any = [];
  row_3_report: any = [];
  row_4_report: any = [];
  innerWidth = 0;
  sabDelegateUser: any;
  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private router: Router,
    private _loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.admin = this.userInformation.admin;
    this.loginId = this.userInformation.sabMember.loginId;

    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.mainUrl = this.configService.baseUrl;
    this.reportYear = this.userInformation.reportYear;
    this.innerWidth = window.innerWidth;

    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.sabDelegateUser = JSON.parse(sabDelegateUser);
    }
    this.getReportNameToBeEnabled();
  }

 
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  getReportNameToBeEnabled() {
    let url = 'ReportController/getReportNameToBeEnabled';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this._loading.setLoading(false, url);
      this.reportToBeEnabled = response.reportName;
      this.createReportMenu();
      let reportMenu: any = [];
      for (let i = 0; i < this.row_1_report.length; i++) {
        if (this.row_1_report[i].condition) {

          reportMenu.push(this.row_1_report[i])
        }
        if (i == this.row_1_report.length - 1) {
          this.row_1_report = reportMenu;
        }
      }
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error : ', error);
    });

  }

  generateReport(reportName: any) {
    if (reportName == 'Final Report Launch' || reportName == 'GenerateMasterFile') {
      let url = 'ReportController/generateReports?reportYear=' + this.reportYear + '&reportType=' + reportName + '&reportValue=' + this.reportToBeEnabled + '&userName=' + this.loginId;
      window.open(this.mainUrl + url, '_parent');
    } else {
      let url = 'ReportController/generateReports?reportYear=' + this.reportYear + '&reportType=' + reportName + '&reportValue=' + reportName + '&userName=' + this.loginId;
      window.open(this.mainUrl + url, '_parent');
    }
  }

  nagivateToReport(item: any) {
    if (item.isRedirect) {
      this.router.navigate([item.link])
    } else {
      this.generateReport(item.link)
    }
  }

  createReportMenu() {
    this.row_1_report = [{
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      // brColor:'#5ef1ff',
      brColor: '#549EF2',
      name: "New/Repeated",
      description: "Report that shows the observations in the SAB Initial/Commentary report, and their classification (New/Repeated)",
      isRedirect: true,
      link: '/reports/new-or-repeated-report',
      condition: this.admin == true ? true : false,

      image: '<path data-name="layer2" d="M13 7v38a5 5 0 0 0 5 5h33V12H18a5 5 0 0 1-5-5" fill="#5ef1ff"></path><path data-name="layer1" d="M47 12V2H18a5 5 0 0 0 0 10z" fill="#ffffff"></path><path data-name="opacity" d="M18 2a5 5 0 0 0-5 5 4.9 4.9 0 0 0 .3 1.5A5 5 0 0 1 18 5h29V2zm15 48V34.8L20.8 50H33z" fill="#000064" opacity=".15"></path><path data-name="opacity" d="M18 12a5 5 0 0 1-5-5v38a5 5 0 0 0 5 5V12z" fill="#000064" opacity=".15"></path><path data-name="stroke" d="M41 50h10V12H18a5 5 0 0 1 0-10h29v10" fill="none" stroke="#008a97" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"></path><path data-name="stroke" d="M13 7v38a5 5 0 0 0 5 5h7m8-15.2V62m6-6.2L33 62l-6-6.2" fill="none" stroke="#008a97" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"></path>'
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#43A047',
      name: "Initial/Commentary Comparison",
      isRedirect: true,
      link: '/reports/initial-or-final-report',
      condition: this.admin == true ? true : false,
      description: "Report that shows the observations in the SAB initial report and which of them remained in the Commentary Report"
    },
    //  {
    //   bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
    //   textColor: '#fff',
    //   brColor: '#9E9D24',
    //   name: "Initial/Commentary Observation Titles",
    //   isRedirect: true,
    //   condition: this.admin == true ? true : false,
    //   link: '/reports/initial-or-final-observation-titles',
    //   description: "Report that shows the titles of observations found in a particular SAB report (initial or Commentary)"
    // },
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#9E9D24',
      name: "Initial/Initial Comparison",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/initial-or-initial-comparison-report',
      description: "Report that shows the observations in the current SAB initial report and which of them were available in the previous initial reports."
    },
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#00E676',
      name: "Observations Per Department",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/observations-per-department-report',
      description: "Report that summarizes the total no. of observations assigned per department in each report cycle"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      // brColor:'#2962FF',
      brColor: '#FCAF4A',
      name: "Pending Observations",
      isRedirect: true,
      head: "DCEO,CEO",
      condition: this.admin == true ? true : false,
      // condition: this.userJobTitle == 'DCEO' || this.userJobTitle == 'CEO' || (this.userJobTitle == 'SEC' &&   (this.userInformation.supervisorDetails.userJobTitle == 'DCEO' || 
      // this.userInformation.supervisorDetails.userJobTitle == 'CEO' )) ? true : false,
      link: '/reports/pending-observations-report',
      description: "Report showing the total number of observation pending with DCEO, Manager, and User"
    },
    // ]
    //   this.row_2_report = [
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#7CB342',
      name: "Classification Change",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/classification-change-report',
      description: "Report that shows the classification of each observation across the fiscal year during each cycle"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#009688',
      name: "Classification Count",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/classification-count-report',
      description: "Report that shows the total number of observation that falls within each classification"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#45d3d3',
      name: "Delay Statistics",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/delay-report',
      // link : '/reports',
      description: "Report that shows the no. of days of delay for all observations assigned to a specific department"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      // brColor:'#8E24AA',
      brColor: '#f26f6f',
      name: "Reminder Count",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/reminders-report',
      description: "Report showing the total no. of Reminders sent per observation, belonging to a department"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      // brColor:'#A1887F',
      brColor: '#7986CB',
      name: "User List",
      head: "DCEO,CEO",
      isRedirect: true,
      condition: this.admin == true || this.userJobTitle == 'MGR' || (this.userJobTitle == 'SEC' && this.userInformation.supervisorDetails.userJobTitle == 'MGR') || (this.sabDelegateUser && this.sabDelegateUser.userJobTitle == 'MGR') ? true : false,
      link: '/reports/user-list-report',
      description: "Report that shows the KNPC Department users of the SAB application"
    },
    /**  venkat **/
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#f26f6f',
      name: "Send Back Reasons",
      isRedirect: true,
      condition: this.admin == true ? true : false,
      link: '/reports/sendback-comments-report',
      description: "Report showing the count for observations that have been sent back to the department by G&PA."
    },  
    // ];
    //   this.row_3_report = [
    // {
    //   bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
    //   textColor: '#fff',
    //   brColor: '#EF6C00',
    //   name: "Initial Reponse <br/> Report",
    //   isRedirect: false,
    //   link: 'Initial Response Report',
    //   condition: this.reportToBeEnabled == 'Initial Response Report' && this.reportToBeEnabled != 'SAB Commentary Report'  && this.admin == true ? true : false,
    //   description: "Generate Initial Response Report to send it to SAB within the deadline"
    // }, 
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#EF6C00',
      name: "Initial Response <br/> Report",
      isRedirect: false,
      link: 'KNPC Response Report',
      condition: this.reportToBeEnabled == 'KNPC Response Report' && this.reportToBeEnabled != 'SAB Commentary Report'  && this.admin == true ? true : false,
      description: "Generate Initial Response Report to send it to SAB within the deadline"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#283593',
      name: "SAB Quarterly <br/> Report Q1",
      isRedirect: false,
      condition: this.reportToBeEnabled == 'SAB Quarterly Report Q1' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      link: 'SAB Quarterly Report Q1',
      description: "Generate Quarterly Report Q1 to provide KPC with an update regarding the responses"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#4DB6AC',
      name: "SAB Semi-Annual <br/> Report 1",
      isRedirect: false,
      condition: this.reportToBeEnabled == 'SAB Semi-annual Report 1' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      link: 'SAB Semi-annual Report 1',
      description: "Generate Semi-Annual Report SA1 to provide KPC with an update regarding the responses"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#827717',
      name: "SAB Quarterly <br/> Report Q2",
      isRedirect: false,
      condition: this.reportToBeEnabled == 'SAB Quarterly Report Q2' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      link: 'SAB Quarterly Report Q2',
      description: "Generate Quarterly Report Q2 to provide KPC with an update regarding the responses"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#F9A825',
      name: "SAB Semi-Annual <br/> Report 2",
      isRedirect: false,
      condition: this.reportToBeEnabled == 'SAB Semi-annual Report 2' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      link: 'SAB Semi-annual Report 2',
      description: "Generate Semi-Annual Report SA2 to provide KPC with an update regarding the responses"
    },
    // ]
    //   this.row_4_report = [
    {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#00695C',
      name: "SAB Quarterly <br/> Report Q3",
      isRedirect: false,
      link: 'SAB Quarterly Report Q3',
      condition: this.reportToBeEnabled == 'SAB Quarterly Report Q3' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      description: "Generate Quarterly Report Q3 to provide KPC with an update regarding the responses"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#7986CB',
      name: "SAB Quarterly <br/> Report Q4",
      isRedirect: false,
      link: 'SAB Quarterly Report Q4',
      condition: this.reportToBeEnabled == 'SAB Quarterly Report Q4' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      description: "Generate Quarterly Report Q4 to provide KPC with an update regarding the response"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#607D8B',
      name: "KNPC Final <br/> Report",
      isRedirect: false,
      link: 'Final Report Launch',
      condition: this.reportToBeEnabled != '' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      description: "Generate KNPC Final Report that contains the latest update for the observations"
    }, {
      bgColor: 'linear-gradient(to right, rgb(132 162 169) 0%, #2a83e3 150%)',
      textColor: '#fff',
      brColor: '#795548',
      name: "Master File",
      isRedirect: false,
      link: 'GenerateMasterFile',
      condition: this.reportToBeEnabled != '' && this.reportToBeEnabled != 'SAB Commentary Report' && this.admin == true ? true : false,
      description: "Generate Master File"
    }]
  }
}
