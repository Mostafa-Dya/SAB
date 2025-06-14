import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ArchiveResponseNotesComponent } from '../archive-response-notes/archive-response-notes.component';
import { ArchivedResponseContentComponent } from '../archived-response-content/archived-response-content.component';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';

export interface ObservationData {
  "cycle": string,
  "from": string,
  "to": string,
  "stepName": string,
  "dept": string,
  "dateTime": string,
  "response": string,
  "attachments": string,
  "completionDate": string,
  "classification": string,
  "gpa": string,
  "adjustmentMadeOnBehalfOf": string,
  "reasonComment": string,
  // "gpaAttachment": string
}

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';

@Component({
  selector: 'app-archived-observation-details',
  standalone: true,
  imports: [CommonModule, SharedModule, ArchiveResponseNotesComponent, ArchivedResponseContentComponent, AttachmentListComponent, ExpandContentComponent],
  templateUrl: './archived-observation-details.component.html',
  styleUrls: ['./archived-observation-details.component.scss']
})
export class ArchivedObservationDetailsComponent implements OnInit {
  id: string;
  isRtl = signal(false);
  obsContant: any = "";
  obsId: string;
  workItem: any;
  loginId: string;
  isLoading: boolean = true;
  reportCycle: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['from', 'to', 'stepName', 'actionTaken', "responseDate", "response", "attachments",  "completionYear","classification", "comment"];
  displayedColumnsMob: string[] = ['obsTitle'];
  observationCycles = [{
    value: 'Initial Report',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Quarterly Report Q1',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Quarterly Report Q2',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Quarterly Report Q3',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Quarterly Report Q4',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Semi-annual Report 1',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }, {
    value: 'SAB Semi-annual Report 2',
    departments: [{
      "headerName": '',
      "dataSource": new MatTableDataSource([])
    }],
    isVisible: false
  }]
  observationNotes: any = {
    notes: []
  };
  isAdmin: boolean = false;
  userInformation: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private route: ActivatedRoute,
    private coreService: CoreService,
    public dialog: MatDialog,
    private _loading: LoadingService,
    private sharedVariableService: SharedVariableService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl.set(value);
    });
    this.route.params.subscribe(params => {
      this.id = params['obsId'];
    });
    let userData: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(userData);
    this.isAdmin = this.userInformation.admin;
    this.getObservationInfo();
    this.getNotes();
  }

  getObservationInfo() {
    this.isLoading = true; 
    let url = 'respAuditController/getAuditInfo?obsId=' + this.id;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      // let response: any = {"irDetails":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}],"obsId":"2021-2022","obsSeq":1,"obsTitle":"أولا:  OBI1الملاحظات المتعلقة بمشروع sالوقود البيئيA:","q1Details":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}],"q2Details":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}],"q4Details":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}],"sa1Details":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}],"sa2Details":[{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"CPD Dept"},{"auditList":[{"actionTaken":"Approve","comment":"Sample Comment","completionYear":"2021-2022","from":"ECMTEST_HR_ENG","hasAttachments":true,"hasResponse":true,"responseDate":"2021-12-06 11:27:34.000","responseId":"00e2b678-0900-47a4-95a2-3d14eb982e1e","stepName":"G&PAReview","to":"ECMTEST_HR_ENG"}],"headerName":"IT Dept"}]}
      //  let response:any  = {"obsId":"2021-2022-3","obsTitle":"   2- \tالملاحظات الخاصة بالعقد رقم (CFP/MISC/0064):","obsSeq":3,"irDetails":[{"headerName":"Corporate Planning","auditList":[{"responseId":"285947be-b82f-4b86-9e77-360331083ef1","stepName":"Pending Assignment to department","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"CPD Manager(MGR)","hasResponse":false,"hasAttachments":true,"responseDate":"2022-04-24 15:09:34.0"},{"responseId":"496198ba-13f1-4392-8ca9-9f8a0cb2bceb","stepName":"Pending Assignment to Department Staff","actionTaken":"Send Response","from":"CPD Manager(MGR)","to":"DCEO Planning and Finance(DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-04-24 15:10:05.0","completionYear":""},{"responseId":"70a1906c-e522-4a8c-a5e6-c81c7e13df92","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-04-24 15:10:40.0"},{"responseId":"56ec4a14-d43e-4fae-9f58-fb128ae74bb1","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-04-24 15:12:01.0"},{"responseId":"3b82363e-cab4-484d-985f-bbb7138d68eb","stepName":"Pending G&PA Approval","actionTaken":"Complete","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-04-24 15:12:09.0"}]}],"q1Details":[]}
        // let response:any = {"obsId":"2021-2022-5","obsTitle":"   6- \tالملاحظات المتعلقة بعقود المقاولين البديلين لمشروع الوقود البيئي:","obsSeq":5,"irDetails":[{"headerName":"N/A","auditList":[{"responseId":"bd08b7e2-518e-4e94-81dd-1ebc671d5bfa","stepName":"Pending Assignment to department","actionTaken":"Respond On Behalf","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 19:31:41.0"},{"responseId":"020b92ed-96e8-4136-b85f-5c1dc368e136","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 19:32:27.0"},{"responseId":"e0564e86-09d7-42e4-bed5-9f583a589ff9","stepName":"Pending G&PA Approval","actionTaken":"Complete","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 19:32:36.0"},{"responseId":"1ac70f5e-541a-433d-8313-61aa90f6f151","stepName":"Edit Response by G&PA","actionTaken":"Edit Response","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":true,"responseDate":"2022-05-11 19:39:31.0","comment":"ديوان المحاسبة - عقبات يمكن أن تواجه المشروع عند تطبيق  التأخير ولكن تم تأجيل تطبيقها ل"}]}],"q1Details":[{"headerName":"N/A","auditList":[]},{"headerName":"Corporate Planning","auditList":[{"responseId":"f1d67b31-ec36-45e5-9668-421137cb2bac","stepName":"Pending Assignment to department","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"CPD Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-05-11 21:08:03.0"},{"responseId":"aa81ec97-ae5f-4b10-a3a8-38366e150feb","stepName":"Pending Assignment to Department Staff","actionTaken":"Assign To Staff","from":"CPD Manager (MGR)","to":"Team Lead Plans Coordination (TL)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-05-11 21:11:00.0"},{"responseId":"57727cd7-14e8-4814-9aa1-04953bbc3ece","stepName":"Pending Assignment or Response TeamLead","actionTaken":"Send Response","from":"Team Lead Plans Coordination(TL)","to":"CPD Manager(MGR)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:11:39.0","completionYear":"2022-2023"},{"responseId":"d0e52abb-1d0e-497c-a527-4704d5d854a1","stepName":"Pending Department Manager Approval","actionTaken":"Approve","from":"CPD Manager (MGR)","to":"DCEO Planning and Finance(DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:14:19.0","completionYear":"2022-2023"},{"responseId":"4fea5592-789d-4372-a7be-e95c475a3811","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:16:03.0","completionYear":"2022-2023"},{"responseId":"e3c1ebc7-1acc-4a95-8068-80e338098fa2","stepName":"Pending G&PA Review","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:17:45.0","completionYear":"2022-2023"},{"responseId":"e7564666-0066-487b-95be-abdc9aac8219","stepName":"Pending Combine & Complete Response","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:18:23.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"081c1026-4ef6-43d7-8991-d6a945c52f2f","stepName":"Edit Response by G&PA","actionTaken":"Edit Response","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":true,"responseDate":"2022-05-11 21:21:28.0","completionYear":"متباين الرأى بشأنها","comment":"عن مجلس الإدارة - التالي يبين أمثلة على ذلك استمرار وجود العديد من المطالبات يرجع تاريخ التالي يبين"}]},{"headerName":"Information Technology","auditList":[{"responseId":"f08a0198-9258-4717-b01d-c3c70a4cd651","stepName":"Pending Assignment to department","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"IT Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-05-11 21:08:04.0"},{"responseId":"d0d7a884-f868-4eb7-b048-bc5fc7bb6a14","stepName":"Pending Assignment to Department Staff","actionTaken":"Assign To Staff","from":"IT Manager (MGR)","to":"Team Lead Information Technology (TL)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-05-11 21:12:51.0"},{"responseId":"a92a875d-0316-4d9e-94fe-0517b41fc987","stepName":"Pending Assignment or Response TeamLead","actionTaken":"Send Response","from":"Team Lead Information Technology(TL)","to":"IT Manager(MGR)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:14:00.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"3d97d88b-1eef-470b-942c-76024c822739","stepName":"Pending Department Manager Approval","actionTaken":"Approve","from":"IT Manager (MGR)","to":"DCEO Projects(DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:15:07.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"cbc8ce20-7e48-4b92-b503-6ed83a1872c8","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Projects (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:17:29.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"0d590a3e-3785-449e-8411-2605b1380ccc","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:17:53.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"bd7a142f-a789-42da-91ab-49b21d133757","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:18:07.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"a660818a-221b-44ba-817a-c89580cd4f7d","stepName":"Pending Combine & Complete Response","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-05-11 21:18:23.0","completionYear":"متباين الرأى بشأنها"},{"responseId":"a8e30ea3-b43c-409f-8b26-3a40e21a64a6","stepName":"Edit Response by G&PA","actionTaken":"Edit Response","from":"G&PA Team(Government & Parliament Affairs Engineer)","to":"G&PA Team","hasResponse":true,"hasAttachments":true,"responseDate":"2022-05-11 21:21:28.0","completionYear":"متباين الرأى بشأنها","comment":"عن مجلس الإدارة - التالي يبين أمثلة على ذلك استمرار وجود العديد من المطالبات يرجع تاريخ التالي يبين"}]}]}
      // let response:any = {"obsId":"2021-2022-5","obsTitle":"   6- \tالملاحظات المتعلقة بعقود المقاولين البديلين لمشروع الوقود البيئي:","obsSeq":5,"irDetails":[{"headerName":"N/A","auditList":[{"responseId":"3b0cb040-d299-4cbb-9c33-96f0c28650b3","stepName":"Pending Assignment to department","actionTaken":"Respond On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-09-20 07:30:35.0"},{"responseId":"71692d8c-c4b3-4b58-aaf9-2c609dc5846f","stepName":"Pending G&PA Review","actionTaken":"Complete","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-09-20 07:31:58.0"}]}],"q1Details":[],"sa1Details":[{"headerName":"N/A","auditList":[{"responseId":"89ae3e1b-8dc5-4436-9a50-508a663ac212","stepName":"G&PA Direct Launch","actionTaken":"Launch Report","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"G&PA Team","hasResponse":false,"hasAttachments":false,"responseDate":"2022-09-20 07:43:34.0"}]},{"headerName":"Chief Executive Officer's Office","auditList":[{"responseId":"a1e434d2-ab8f-49f1-9fc0-ef65460d889e","stepName":"Pending Assignment to department","actionTaken":"Assign To CEO","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"Chief Executive Officer (CEO)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-09-20 07:52:51.0"},{"responseId":"a5cbc04b-a74c-40ab-ba5d-e91f98269f4b","stepName":"Pending Assignment To DCEO/Manager","actionTaken":"Respond On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-09-20 07:53:31.0","completionYear":" تم الانتهاء من إجراءاتها"},{"responseId":"d459665f-13c5-4551-99e3-672081ca9283","stepName":"Pending G&PA Review","actionTaken":"Complete","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-09-20 07:54:01.0","completionYear":" تم الانتهاء من إجراءاتها"}]}]}
      // response = {"obsId":"2021-2022-4","obsTitle":"  3- \tالملاحظات الخاصة بمطالبات المقاولين:","obsSeq":4,"irDetails":[{"headerName":"Corporate Planning","auditList":[{"responseId":"76139db9-48da-4b5f-b46f-ee3a69849f46","stepName":"Pending Assignment to department","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer (ENG))","to":"CPD Manager (MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 11:29:07.0"},{"responseId":"1ab1f09d-5f95-4174-8dc4-ade3c3d01b50","stepName":"Pending Assignment To Department Staff","actionTaken":"Send Response","from":"CPD Manager (MGR)","to":"DCEO Planning and Finance (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:31:16.0","completionYear":""},{"responseId":"60e1b21d-15b2-4da0-a44a-17afcbd39692","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:40:15.0"},{"responseId":"3bbac920-fbf9-4efd-abcc-5f674e1a6d4b","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:42:07.0"},{"responseId":"824b0c86-fb24-4913-af77-ac27538b0393","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:42:16.0"},{"responseId":"8f13a958-fc0c-4b5b-b3da-96f93839ce63","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:44:20.0"}]},{"headerName":"Information Technology","auditList":[{"responseId":"fd68f25d-1d43-4d87-9849-a4b04b514f05","stepName":"Pending Assignment to department","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer (ENG))","to":"IT Manager (MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 11:29:08.0"},{"responseId":"438a8d7f-6ad2-447f-9f28-b8560970cd3f","stepName":"Pending Assignment To Department Staff","actionTaken":"Respond On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"DCEO Support Services (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:40:27.0"},{"responseId":"996e426b-83a2-43bd-83fc-6bd32ed80efd","stepName":"Pending DCEO Approval","actionTaken":"Approve On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:42:24.0"},{"responseId":"f0324d5f-545a-48a1-b957-a74feb2e835e","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:42:39.0"},{"responseId":"6c90cbb2-b411-413b-8d51-a05d0a4fab8f","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:42:53.0"},{"responseId":"ab17e8a1-fcb6-4e77-97b4-82a0fb49cf0c","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 11:44:20.0"}]}],"q1Details":[{"headerName":"Corporate Planning","auditList":[{"responseId":"aa432f24-a7e5-4480-adb4-bd242124d9c8","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"CPD Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 13:08:23.0"}]},{"headerName":"Information Technology","auditList":[{"responseId":"4eb78f8d-f427-4873-be7f-e37d81c5403c","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"IT Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 13:08:24.0"}]}],"sa1Details":[{"headerName":"Corporate Planning","auditList":[{"responseId":"4fe0d2cc-60cb-4f69-a108-d1a65af3a1d8","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"CPD Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 11:53:17.0"},{"responseId":"23531a74-8c05-419b-b45d-3a5c40f22117","stepName":"Pending Assignment To Department Staff","actionTaken":"Send Response","from":"CPD Manager (MGR)","to":"DCEO Planning and Finance (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:08:51.0","completionYear":"2022-2023"},{"responseId":"161a41ac-8e69-4f92-87d7-4b56ada697c8","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:12:14.0","completionYear":"2022-2023"},{"responseId":"4fb772c4-6774-46fc-a35d-de4de9ae3714","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:14.0","completionYear":"2022-2023"},{"responseId":"a30b2cc9-58fe-447b-b6f8-9be6edeab68f","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:26.0","completionYear":"2022-2023"},{"responseId":"287b1e65-e4e5-40cb-928a-d0eb1fc0648d","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:51.0","completionYear":"2022-2023"}]},{"headerName":"Information Technology","auditList":[{"responseId":"37a54794-308e-4d22-97e7-b37c180f3583","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"IT Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 11:53:17.0"},{"responseId":"7fd2e0b9-2d1c-42be-b6d9-5c3622452394","stepName":"Pending Assignment To Department Staff","actionTaken":"Respond On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"DCEO Support Services (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:13:15.0","completionYear":"2023-2024"},{"responseId":"28cd9e2e-f609-4450-a4d6-e92df5ab034f","stepName":"Pending DCEO Approval","actionTaken":"Approve On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:13:46.0","completionYear":"2023-2024"},{"responseId":"4bbd5306-d434-4ac3-a85f-d2689b9e074b","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:22.0","completionYear":"2023-2024"},{"responseId":"ef18c6e8-211b-46d9-991c-1cfddc6212c2","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:30.0","completionYear":"2023-2024"},{"responseId":"fdc4cef9-009a-49d6-ac53-c030d985eef5","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:15:51.0","completionYear":"2022-2023"}]}],"sa2Details":[{"headerName":"Corporate Planning","auditList":[{"responseId":"14d5c0cf-b9d9-4b8f-89a0-bb87a9754953","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"CPD Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 12:21:30.0"},{"responseId":"fd04196c-7fc0-4529-b8e0-2b9c43c4dccc","stepName":"Pending Assignment To Department Staff","actionTaken":"Send Response","from":"CPD Manager (MGR)","to":"DCEO Planning and Finance (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:27:33.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"6706982e-7dd2-491f-be65-1b2d986dd491","stepName":"Pending DCEO Approval","actionTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:28:22.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"af4beb50-dfd9-4bb0-8f2f-bdbcbf6f7e57","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:43:19.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"f5faf2a6-f82f-422b-ba75-7ab5e64f3f19","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:43:34.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"44f07e7c-f10c-4c56-98b0-f459d3926957","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:58:10.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"0b41e63c-1944-42e9-9b0a-1bca196f4176","stepName":"Edit Response by G&PA","actionTaken":"Edit Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:58:54.0","completionYear":"تتعلق بجهات حكومية/اخرى","comment":"عن مجلس الإدارة - اللجوء إلى المحاكم المحلية"}]},{"headerName":"Information Technology","auditList":[{"responseId":"6c422db1-08df-4f4b-b40b-6396ee0f5f28","stepName":"G&PA Direct Launch","actionTaken":"Send To Department","from":"G&PA Team(Government & Parliament Affairs Engineer(ENG))","to":"IT Manager(MGR)","hasResponse":false,"hasAttachments":false,"responseDate":"2022-10-11 12:21:30.0"},{"responseId":"b413dfb6-fe12-4257-b10e-8fec60b37790","stepName":"Pending Assignment To Department Staff","actionTaken":"Respond On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"DCEO Support Services (DCEO)","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:28:57.0","completionYear":"تتعلق بجهات حكومية/اخرى","comment":"Ministry of Telecom"},{"responseId":"ff30cdf5-1978-47d9-891e-85a9acb478ed","stepName":"Pending DCEO Approval","actionTaken":"Approve On Behalf","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:43:04.0","completionYear":"تتعلق بجهات حكومية/اخرى","comment":"Ministry of Telecom"},{"responseId":"d8301477-ff77-4a46-a0b4-5b7b3a02533a","stepName":"Pending G&PA Review","actionTaken":"Review","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:43:25.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"558ee081-d965-47de-a39a-7fe9dc360de1","stepName":"Pending G&PA Approval","actionTaken":"Approve & Combine Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:43:42.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"52430324-1645-48a3-bc1c-ac44fd60b7a7","stepName":"Pending Combine Response Update","actionTaken":"Complete","from":"Government & Parliament Affairs Engineer (G&PA Team)","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:58:10.0","completionYear":"تتعلق بجهات حكومية/اخرى"},{"responseId":"d8bba1fb-9377-4e48-a1ab-855fa74dd9da","stepName":"Edit Response by G&PA","actionTaken":"Edit Response","from":"G&PA Team (Government & Parliament Affairs Engineer (ENG))","to":"G&PA Team","hasResponse":true,"hasAttachments":false,"responseDate":"2022-10-11 12:58:54.0","completionYear":"تتعلق بجهات حكومية/اخرى","comment":"عن مجلس الإدارة - اللجوء إلى المحاكم المحلية"}]}]}
        if (response.hasOwnProperty('irDetails') && response.irDetails.length > 0) {
        // this.observationCycles[0].departments = response.irDetails 
        for (let i = 0; i < response.irDetails.length; i++) {
          if (i == 0) {
            this.observationCycles[0].departments.pop()
          }
          if( ((response.irDetails[i].headerName != 'NA' && response.irDetails[i].auditList.length > 0) || response.irDetails.length == 1) ){
            for(let a = 0 ; a < response.irDetails[i].auditList.length ;a++){
              if(!response.irDetails[i].auditList[a].hasOwnProperty('classification')){
                response.irDetails[i].auditList[a].classification = '';
              }
            }
            this.observationCycles[0].departments.push({
              "headerName": response.irDetails[i].headerName,
              "dataSource": new MatTableDataSource(response.irDetails[i].auditList)
            })    
        }
        }
        this.observationCycles[0].isVisible = true;
      } else {
        this.observationCycles[0].isVisible = false;
      }
      if (response.hasOwnProperty('q1Details') && response.q1Details.length > 0) {
        for (let i = 0; i < response.q1Details.length; i++) {
          if (i == 0) {
            this.observationCycles[1].departments.pop()
          }
          if( (response.q1Details[i].headerName != 'NA' && response.q1Details[i].auditList.length > 0) || response.q1Details.length == 1){
            this.observationCycles[1].departments.push({
              "headerName": response.q1Details[i].headerName,
              "dataSource": new MatTableDataSource(response.q1Details[i].auditList)
            })
          } 
        }
        this.observationCycles[1].isVisible = true;
      } else {
        this.observationCycles[1].isVisible = false;
      }
      if (response.hasOwnProperty('q2Details') && response.q2Details.length > 0) {
        for (let i = 0; i < response.q2Details.length; i++) {
          if (i == 0) {
            this.observationCycles[2].departments.pop()
          }
          if( (response.q2Details[i].headerName != 'NA' && response.q2Details[i].auditList.length > 0) || response.q2Details.length == 1){
          this.observationCycles[2].departments.push({
            "headerName": response.q2Details[i].headerName,
            "dataSource": new MatTableDataSource(response.q2Details[i].auditList)
          })
        }
        }
        this.observationCycles[2].isVisible = true;
      } else {
        this.observationCycles[2].isVisible = false;
      }
      if (response.hasOwnProperty('q3Details') && response.q3Details.length > 0) {
        for (let i = 0; i < response.q3Details.length; i++) {
          if (i == 0) {
            this.observationCycles[3].departments.pop()
          }
          if( (response.q3Details[i].headerName != 'NA' && response.q3Details[i].auditList.length > 0) || response.q3Details.length == 1){
            this.observationCycles[3].departments.push({
              "headerName": response.q3Details[i].headerName,
              "dataSource": new MatTableDataSource(response.q3Details[i].auditList)
            })
          }
        }
        this.observationCycles[3].isVisible = true;
      } else {
        this.observationCycles[3].isVisible = false;
      }
      if (response.hasOwnProperty('q4Details') && response.q4Details.length > 0) {
        for (let i = 0; i < response.q4Details.length; i++) {
          if (i == 0) {
            this.observationCycles[4].departments.pop()
          }
          if( (response.q4Details[i].headerName != 'NA' && response.q4Details[i].auditList.length > 0) || response.q4Details.length == 1){
            this.observationCycles[4].departments.push({
              "headerName": response.q4Details[i].headerName,
              "dataSource": new MatTableDataSource(response.q4Details[i].auditList)
            })
          }
        }
        this.observationCycles[4].isVisible = true;
      } else {
        this.observationCycles[4].isVisible = false;
      }
      if (response.hasOwnProperty('sa1Details') && response.sa1Details.length > 0) {
        for (let i = 0; i < response.sa1Details.length; i++) {
          if (i == 0) {
            this.observationCycles[5].departments.pop()
          }
          if( (response.sa1Details[i].headerName != 'NA' && response.sa1Details[i].auditList.length > 0) || response.sa1Details.length == 1 ){
            this.observationCycles[5].departments.push({
              "headerName": response.sa1Details[i].headerName,
              "dataSource": new MatTableDataSource(response.sa1Details[i].auditList)
            })
          }
          console.log(response.sa1Details[i].headerName,'aaa')
        }
        this.observationCycles[5].isVisible = true;
      } else {
        this.observationCycles[5].isVisible = false;
      }
      if (response.hasOwnProperty('sa2Details') && response.sa2Details.length > 0) {
        for (let i = 0; i < response.sa2Details.length; i++) {
          if (i == 0) {
            this.observationCycles[6].departments.pop()
          }
          if( (response.sa2Details[i].headerName != 'NA' && response.sa2Details[i].auditList.length > 0) || response.sa2Details.length == 1){
            this.observationCycles[6].departments.push({
              "headerName": response.sa2Details[i].headerName,
              "dataSource": new MatTableDataSource(response.sa2Details[i].auditList)
            })
          }
        }
        this.observationCycles[6].isVisible = true;
      } else {
        this.observationCycles[6].isVisible = false;
      }
      this.obsId = response.obsId;
      this.reportCycle = response.reportCycle;
      this.workItem = response;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  viewResponse(responseId: any, type: any) {

    if (type == 'text') {
      let url = 'respAuditController/getResponse?responseId=' + responseId;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        // let response = {obsResponse : ''}
        let observation = {
          obsContent: response.obsResponse
        }
        const dialogRef = this.dialog.open(ArchivedResponseContentComponent, {
          data: observation
        });
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error  :', error);
      });
    } else {
      let url = 'respAuditController/getAttachments?responseId=' + responseId;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        // let response = [{"docId":"0a3243f1-5dda-450f-988c-2f82a769c583","name":"تأخر انتهاء بعض مراحل مشروع الوقود البيئي حيث أشارت التوقعات لبعض الحزم أنه سيتم الانتهاء من تنفيذها في عام 2020 وكان مخطط له عام 2017، والبيان","createdDate":"2021-12-26 15:00:32.0","attachedBy":"ECMTest User2(ENG)"}]
        let observation = {
          attachment: response
        }
        const dialogRef = this.dialog.open(AttachmentListComponent, {
          data: observation
        });
      }, error => {
        this._loading.setLoading(false, url);
        console.log('error  :', error);
      });
    }
  }

  tabClick() {
    // this.accordion.closeAll();
  }

  getNotes() {
    let url = 'respAuditController/getObservationNotes?obsId=' + this.id;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(async response => {
      this._loading.setLoading(false, url);
      //    let response =  [
      //   {
      //     "id": 8,
      //     "obsId": "2021-2022-1",
      //     "addedBy": "ECMTEST_HR_ENG",
      //     "notes": "ABC",
      //     "addedDate": "26/04/2022"
      //   },
      //   {
      //     "id": 10,
      //     "obsId": "2021-2022-1",
      //     "addedBy": "ECMTEST_HR_ENG",
      //     "notes": "16/12/2016، مما أدى إلى اصدار أمر تغييري رقم 3 بأثر رجعي بالتمديد لمدة 6 أشهر بتاريخ 5/1/2016، ومن الجدير بالذكر انتهاء العقد بتاريخ 16/12/2016",
      //     "addedDate": "03/05/2022"
      //   }
      // ];

      response.sort((a: any, b: any) => {
        let fa = a.addedDate,
          fb = b.addedDate;
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.observationNotes = {
        notes: response
      }

    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    });
  }
  showNotes() {
    const dialogRef = this.dialog.open(ArchiveResponseNotesComponent, {
      data: this.observationNotes
    });
  }
}