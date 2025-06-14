import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { PastHistoryComponent } from '../past-history/past-history.component';

@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.component.html',
  styleUrls: ['./observation-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ObservationDetailsComponent implements OnInit {
  histortTableColumns: string[] = ['id', 'historyDate', 'stepName', 'responseTaken', 'from', 'to'];
  id: string;
  isRtl: any;
  obsContant: any = "";
  obsId: string;
  workItem: any;
  loginId: string;
  isLoading: boolean = true;
  reportCycle: string;
  linkType:string= '';
  reportYear:string;
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
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.id = params['obsId'];      
    });
    this.route.queryParams.subscribe(params => {
      this.linkType = params['linkType'];
  });
  this.route.queryParams.subscribe(params => {
    this.reportYear = params['reportYear'];
});
    this.getObservationInfo();
  }
  getObservationInfo() {
    this.isLoading = true;  
    
    let url = 'launchObservations/searchObservationById?obsId=' + this.id + "&r=" + (Math.floor(Math.random() * 100) + 100) + "&reportYear="+this.reportYear;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.obsId = response.obsId;
      this.reportCycle = response.reportCycle;
      this.workItem = response;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :', error);
    });
  }

  onPastHistory(): void {
    let url = 'workItemController/getPastHistory?stepCustomId=' + this.id + '&obsId=' + this.obsId;
  
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      // response = [{"historyName":"KNPC Response Report","historyList":[{"id":35918,"stepName":"G&PA Team","responseTaken":"Launch Report","from":"G&PA Team (HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Initial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"historyDate":"2022-03-13 08:02:13.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35937,"stepName":"Pending Assignment to department","responseTaken":"Send To Department","from":"G&PA Team (HR Engineer(ENG))","to":"IT Manager(MGR);CPD Manager(MGR);","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":222111,"receiverDeptCode":0,"historyDate":"2022-03-13 08:15:54.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35950,"stepName":"Pending Assignment to Department Staff","responseTaken":"Assign To Staff","from":"CPD Manager (MGR)","to":"ECMTest User2 (ENG); Team Lead Plans Coordination (TL); ","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":103010,"receiverDeptCode":103010,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","obsCategory":"Normal","historyDate":"2022-03-13 08:19:14.0","addedByUserId":"ECMTEST_MGR_CP","committeeId":0},{"id":35953,"stepName":"Pending Response","responseTaken":"Send Response","from":"Team Lead Plans Coordination(TL)","to":"CPD Manager(MGR)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:19:58.0","addedByUserId":"ECMTEST_TL_CP_PLANS","committeeId":0},{"id":35954,"stepName":"Pending Response","responseTaken":"Send Response","from":"ECMTest User2(ENG)","to":"CPD Manager(MGR)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:20:13.0","addedByUserId":"ECMTEST_USER2","committeeId":0},{"id":35955,"stepName":"Pending Department Manager Approval","responseTaken":"Approve","from":"CPD Manager(MGR)","to":"CPD Manager(MGR)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:20:24.0","addedByUserId":"ECMTEST_MGR_CP","committeeId":0},{"id":35956,"stepName":"Pending Department Manager Approval","responseTaken":"Approve","from":"CPD Manager(MGR)","to":"CPD Manager(MGR)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:20:25.0","addedByUserId":"ECMTEST_MGR_CP","committeeId":0},{"id":35958,"stepName":"Pending Combine Response Update","responseTaken":"Approve","from":"CPD Manager (Manager)","to":"DCEO Planning and Finance(DCEO)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:20:54.0","addedByUserId":"ECMTEST_MGR_CP","committeeId":0},{"id":35960,"stepName":"Pending DCEO Approval","responseTaken":"Approve","from":"DCEO Planning and Finance (DCEO)","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:21:21.0","addedByUserId":"ECMTEST_DCEOPF","committeeId":0},{"id":35966,"stepName":"Pending G&PA Review","responseTaken":"Review","from":"G&PA Team (HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:23:14.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35967,"stepName":"Pending G&PA Approval","responseTaken":"Approve & Combine Response","from":"G&PA Team (HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"08788ba4-bd8d-4b0c-be44-2731d0695b5b","historyDate":"2022-03-13 08:23:23.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35969,"stepName":"Pending Assignment to Department Staff","responseTaken":"Send Response","from":"IT Manager(MGR)","to":"DCEO Projects(DCEO)","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"50b6f0b9-569e-4cbf-a385-389ada2e6dd8","historyDate":"2022-03-13 08:25:45.0","addedByUserId":"ECMTEST_IT_MGR","committeeId":0},{"id":35971,"stepName":"Pending DCEO Approval","responseTaken":"Approve On Behalf","from":"G&PA Team(HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"50b6f0b9-569e-4cbf-a385-389ada2e6dd8","historyDate":"2022-03-13 08:27:38.0","addedByUserId":"ECMTEST_DCEOP","committeeId":0},{"id":35974,"stepName":"Pending G&PA Review","responseTaken":"Review","from":"G&PA Team (HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"50b6f0b9-569e-4cbf-a385-389ada2e6dd8","historyDate":"2022-03-13 08:35:25.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35976,"stepName":"Pending G&PA Approval","responseTaken":"Approve & Combine Response","from":"G&PA Team (HR Engineer(ENG))","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"50b6f0b9-569e-4cbf-a385-389ada2e6dd8","historyDate":"2022-03-13 08:43:48.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0},{"id":35977,"stepName":"Pending Combine & Complete Response","responseTaken":"Complete","from":"HR Engineer (G&PA Team)","to":"G&PA Team","obsId":"2020-2021-5","reportYear":"2020-2021","reportName":"Intial Report","reportCycle":"KNPC Response Report","senderDeptCode":0,"receiverDeptCode":0,"deptCycleId":"50b6f0b9-569e-4cbf-a385-389ada2e6dd8","historyDate":"2022-03-13 08:44:11.0","addedByUserId":"ECMTEST_HR_ENG","committeeId":0}]}]
      this._loading.setLoading(false, url);
      response.reportCycle = this.reportCycle;
      const dialogRef = this.dialog.open(PastHistoryComponent, {
        width: '800px',
        data: response
      });
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }
  
  onExapnd(data: any) {
    let observation = {
      obsContent: data
    }
    const dialogRef = this.dialog.open(ExpandContentComponent, {
      data: observation
    });
  }
  tabClick() {
    this.accordion.closeAll();
  }
}
