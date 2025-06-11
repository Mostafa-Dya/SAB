import { Component, OnInit,Inject,AfterViewInit,ViewChild, ElementRef  } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ObservationCard } from 'src/app/models/observationCard.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { ConfigService } from 'src/app/services/config.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CoreService } from 'src/app/services/core.service';
import { EmailDocumentComponent } from '../email-document/email-document.component';
import { MatDialog } from '@angular/material/dialog';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as ClassicEditor from '../../../../public/assets/js/ck-editor-plugin/ckeditor';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit,AfterViewInit  {
  @ViewChild('topElement') topElement: ElementRef;
  public Editor = ClassicEditor;
  public model = {
    editorData: '',
    previous : ''
  };
  isRtl: any;
  responseDetails : any = {};
  obsId: string;
  workItemId: string;
  overViewNotes: string;
  userId: string;
  reportCycle: string;
  userJobTitle: string;
  userInformation: any;
  config = {
    height: 'auto',
    fontFamily: {
      options: [
        'Times New Roman, Times, serif'
      ],
      supportAllValues: false // Allow any font-family value.
    },
    fontSize: {
      options: [
        12
      ],
      supportAllValues: false // Allow any font-size value.
    },
    // toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
    toolbar: ['undo', 'redo'],
    language: 'ar'
  }
  
  isAdmin: boolean = false;
  mainUrl: string;
  constructor(
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    private coreService: CoreService,
    private notification: NzNotificationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public observation: any
    ) { }

  ngOnInit(): void {    
    //console.log(this.observation)
    this.obsId = this.observation.obsId;
    this.workItemId = this.observation.wItemId;
    if (this.observation.overViewNotes) {
      setTimeout(() => this.model.editorData = this.observation.overViewNotes, 200);
    }
   // this.overViewNotes =  ;
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    this.reportCycle =  this.observation.reportCycle;
    //this.departmentCode = this.userInformation.sabMember.directorateCode;
    this.userId = this.userInformation.sabMember.loginId;
    //this.loginId = this.userInformation.sabMember.loginId;
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    
  }
  ngAfterViewInit() {
    // Set focus to the div (it is now focusable because of tabindex="0")
    if (this.topElement) {
      this.topElement.nativeElement.focus();
      this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  onExport() {
    var stepIds: string = '';
    this.mainUrl = this.configService.baseUrl;
    let url = 'ReportController/exportOverViewDetails?obsId=' + this.obsId+'&wItemId='+this.workItemId +'&stepUnqName='+this.observation.stepUnqName+ '&overViewNotes=' + this.model.editorData+'&userId='+this.userId ;
    window.open(this.mainUrl + url, '_parent');
  }
  
  onSendMail(): void {
    let url = 'UserController/getSabMembers';
    const dialogRef = this.dialog.open(EmailDocumentComponent, {
      width: '800px',
       data: { id: 'OverViewSheet'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        let _onBehalf = this.userId;
        let isDelegatedUser = false;
        var transferToDeptData = {
          userId: this.userId,
          userJobTitle: this.userJobTitle,
          onBhalfOf: _onBehalf,
          delegatedUser: isDelegatedUser,
          obsId: this.obsId,
          body: result.data.body,
          subject: result.data.subject,
          toMailIds: result.data.toMailIds,
          ccMailIds: result.data.ccMailIds,
          stepUnqName:this.observation.stepUnqName,
          workItemId: this.workItemId
        }
        this.sendMail(transferToDeptData);
      }
    });
  }
  change(editorData:string){
    if(editorData.includes("<table>")){
      setTimeout(()=>{
        this.model.editorData =  this.model.previous;
        this.notification.create('info', 'Info', "Table is not allowed to add or paste here");
      },)     
    }else{
      if(editorData.includes("<img")){
        setTimeout(()=>{
          this.model.editorData =  this.model.previous;
          this.notification.create('info', 'Info', "Image is not allowed to add or paste here");
        },)     
      }else{
        this.model.previous =  this.model.editorData 
      }
    }
  }
  sendMail(result: any): void {
    let url = 'emailController/sendOverViewDetailsAsMail';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this._loading.setLoading(false, url);
      this.notification.create('success', 'Success', "Overview Sheet email attachment has been sent successfully.");
    }, error => {
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }
  onSave() {
    let formData: FormData = new FormData();
    formData.append('obsId',this.obsId);
    formData.append('overViewNotes', this.model.editorData);
    formData.append('addedByUserId',this.userId);
    formData.append('reportCycle',this.reportCycle);

   // let url = 'InProgController/saveOverViewDetails?obsId=' + this.obsId+ '&overViewNotes=' + this.model.editorData+'&addedByUserId='+this.userId+'&reportCycle='+this.reportCycle ;
   let url = 'InProgController/saveOverViewDetails' ;
    this._loading.setLoading(true, url);
    this.coreService.post(url, formData).subscribe(response => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      this.dialogRef.close({});
    }, error => {
      // this.isDialogLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  
  }
 
}