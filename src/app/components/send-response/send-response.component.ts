import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../../public/assets/js/ck-editor-plugin/ckeditor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { MatTableDataSource } from '@angular/material/table';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { ConfigService } from 'src/app/services/config.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CoreService } from 'src/app/services/core.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';
import { isArray } from 'lodash';

interface DateStrings {
  date: string;
}

export interface Entities {
  name: string;
}

@Component({
  selector: 'app-send-response',
  templateUrl: './send-response.component.html',
  styleUrls: ['./send-response.component.css']
})
export class SendResponseComponent implements OnInit {
  public Editor = ClassicEditor;
  public model = {
    editorData: '',
    previous : ''
  };
  isRtl: any;
  @ViewChild('userFile') userFile: ElementRef;
  selectedFile: File;
  comment: string = '';
  displayedColumns: string[] = ['name', 'attachedBy', 'createdDate', 'action'];
  displayedColumnsMob: string[] = ['name'];
  dataSource = new MatTableDataSource<any>();
  date = '';
  monthFormat = 'MMMM';
  isFileError: boolean;
  errorMessage: string;
  config = {
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
  reportCycle: string;
  isDateFieldSelected = true;
  dateStrings: DateStrings[] = [
    { date: 'متباين الرأى بشأنها' },
    { date: 'تتعلق بجهات حكومية/اخرى' },
    { date: 'تم الانتهاء من إجراءاتها'}
  ];
  selectedDateString: string;
  userInformation: any;
  isAdmin: any;
  mainUrl: any;
  govtEntity: string = '';
  classification: string = '';
  fiscaalYear:any[] = [];
  userId:string;
  isPreviouseDataPresent:boolean = false;
  entities: any = [];

  constructor(
    public dialogRef: MatDialogRef<SendResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private configService: ConfigService,
    private _loading: LoadingService,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private notification: NzNotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
    if(this.responseData.hasOwnProperty('prevCompletionYear') && this.responseData.prevCompletionYear != ''){
      this.isPreviouseDataPresent = true; 
    }
    if (responseData.obsResponse) {
      setTimeout(() => this.model.editorData = responseData.obsResponse, 200);
    }
    if (responseData.attachmens) {
      this.dataSource.data = this.responseData.attachmens;
    }
    this.reportCycle = this.responseData.reportCycle;
  }

  async ngOnInit() {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    // if(this.reportCycle == 'KNPC Response Report'){
    //   this.selectedDateString = this.dateStrings[0].date;
    //   this.date = this.dateStrings[0].date;
    // }    

    if (this.responseData.completionYear) {
     
      if (this.responseData.obsType == 'NEW') {
        this.classification = 'B';
      } else {
        this.classification = 'BD';
      }
      if (this.responseData.obsType == 'NEW') {
        if (this.responseData.completionYear == 'متباين الرأى بشأنها') {
          this.classification = 'C';
        } else if (this.responseData.completionYear == 'تتعلق بجهات حكومية/اخرى') {
          this.classification = 'E';
        }
        //  else if (this.responseData.completionYear == 'Completed')
        else if (this.responseData.completionYear == 'تم الانتهاء من إجراءاتها') {
          this.classification = 'A';
        }
      } else {
        if (this.responseData.completionYear == 'متباين الرأى بشأنها') {
          this.classification = 'CD';
        } else if (this.responseData.completionYear == 'تتعلق بجهات حكومية/اخرى') {
          this.classification = 'ED';
        }
        //  else if (this.responseData.completionYear == 'Completed')
        else if (this.responseData.completionYear == 'تم الانتهاء من إجراءاتها') {
          this.classification = 'A';
        }
      }
    } else {
      // this.selectedDateString = this.dateStrings[0].date;
      if (this.responseData.obsType == 'NEW') {
        this.classification = 'B';
      } else {
        this.classification = 'BD';
      }
    }
    
    if (this.responseData.completionYear) {
      if (this.responseData.completionYear == 'متباين الرأى بشأنها') {
        this.isDateFieldSelected = false;
        this.selectedDateString = this.dateStrings[0].date;
        this.date = this.dateStrings[0].date;
        this.checkSelected(this.date);
      } else if (this.responseData.completionYear == 'تتعلق بجهات حكومية/اخرى') {
        this.isDateFieldSelected = false;
        this.selectedDateString = this.dateStrings[1].date;
        this.date = this.dateStrings[1].date;
        this.checkSelected(this.date);
      } 
      // else if (this.responseData.completionYear == 'Completed') 
      else if (this.responseData.completionYear == 'تم الانتهاء من إجراءاتها')
      {
        this.isDateFieldSelected = false;
        this.selectedDateString = this.dateStrings[2].date;
        this.date = this.dateStrings[2].date;
        this.checkSelected(this.date);
      } else {
        this.isDateFieldSelected = true;
        this.date = this.responseData.completionYear;
        this.checkSelected(this.date);
      }
    } else {
      // this.selectedDateString = this.dateStrings[0].date;
    }
    if (this.responseData.govtEntity) {
      this.entities = this.responseData.govtEntity.split(',');
    }
    this.userId = localStorage.getItem('loginId') || '';
    this.mainUrl = this.configService.baseUrl;
    // this.getUserInfo();
    let reportYear = this.userInformation.reportYear;
    reportYear = reportYear.split('-')[0];
    reportYear = Number(reportYear);
    this.fiscaalYear = await this.sharedVariableService.getYears(reportYear)
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
      }else if (editorData.includes("<ul>") || editorData.includes("<ol>")) {
        setTimeout(() => {
          this.model.editorData = this.model.previous;
          this.notification.create('info', 'Info', "Bullet points are not allowed to add or paste here");
        });
      }else if (editorData.includes("<u>") || editorData.includes("<b>") || editorData.includes("<strong>")) {
        setTimeout(() => {
          this.model.editorData = this.model.previous;
          this.notification.create('info', 'Info', "Underline and bold text are not allowed to add or paste here");
        });
      }
      else{
        this.model.previous =  this.model.editorData 
      }
    }
  }

  onSendResponse(): void {
    if(isArray(this.entities)){
      this.entities = this.entities.filter((item: any) => {
        return item.trim();
      })
    }
    if (this.isFileError) {
      return;
    } else {
      let sendResponseData;
      if (this.reportCycle != 'KNPC Response Report') {
        let completionYear : any = this.date;
        // if (this.isDateFieldSelected) {
          // completionYear = this.date;
        // } else {
        //   completionYear = this.selectedDateString;
        // }
        if (completionYear == 'تتعلق بجهات حكومية/اخرى') {
          sendResponseData = {
            editorData: this.model.editorData,
            comment: this.comment.trim(),
            completionYear: completionYear,
            classification: this.classification,
            govtEntity: this.entities.join(','),
            attach: this.selectedFile
          }
        } else {
          sendResponseData = {
            editorData: this.model.editorData,
            comment: this.comment.trim(),
            completionYear: completionYear,
            classification: this.classification,
            attach: this.selectedFile
          }
        }
      } else {
        sendResponseData = {
          editorData: this.model.editorData,
          comment: this.comment.trim(),
          attach: this.selectedFile
        }
      }
      this.dialogRef.close({ event: 'Send', data: sendResponseData });
    }
  }

  onDraft() {
    let sendResponseData = {
      editorData: this.model.editorData,
      completionYear: this.reportCycle != 'KNPC Response Report' ? this.date : ''
    }
    this.dialogRef.close({ event: 'draft', data: sendResponseData });
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileType = file.name.split('.').pop();
      if (!this.isAdmin) {
        if (file.type === 'application/pdf') {
          if (file.size >= 5 * 1024 * 1024) {
            this.isFileError = true;
            this.errorMessage = 'FILE_SIZE_5MB';
          } else {
            this.isFileError = false;
          }
        } else {
          this.isFileError = true;
          this.errorMessage = 'ONLY_PDF';
        }
        this.selectedFile = file;
      } else {
        if (fileType === 'pdf' || fileType === 'docx' || fileType === 'doc' || fileType === 'msg') {
          if (file.size >= 5 * 1024 * 1024) {
            this.isFileError = true;
            this.errorMessage = 'FILE_SIZE_5MB';
          } else {
            this.isFileError = false;
          }
        } else {
          this.isFileError = true;
          this.errorMessage = 'ALLOWED_FILE';
        }
        this.selectedFile = file;
      }
    }
  }

  clearSelectedFile() {
    this.userFile.nativeElement.value = null;
    this.selectedFile = this.userFile.nativeElement.value;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  // onPaste(e: any) {
  //   e.preventDefault();
  //   return false;
  // };

  // onReady(editor: any) {
  //   const documentView = editor.editing.view.document;
  //   documentView.on("paste", (event: any, data: any) => {
  //     event.stop();
  //     return false;
  //   });
  // }

  downloadAttachment(docId: any) {
    let url = 'DownloadController/downloadAttachByDocId?DocId=' + docId;
    window.open(this.mainUrl + url, '_parent');
  }

  
  deleteAttachment(docId: any, index: any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DELETE',
        dialogMessage: 'ARE_YOU_SURE_DELETE_ATTACHMENT'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        this._onDeleteAttachment(docId,index);
      }
    });
  }


  _onDeleteAttachment(docId: any, index: any) {
    let url = 'launchObservations/deleteAttachment?docId=' + docId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response: any) => {
      this._loading.setLoading(false, url);
      let data = this.dataSource.data;
      this.dataSource.data = [];
      data.splice(index, 1);
      this.dataSource.data = data
      this.notification.create('success', 'Success', response.message);
    }, error => {
      this._loading.setLoading(false, url);
      this.notification.create('error', 'Error', error);
      console.log('error :' , error);
    });
  }
  dateChange() {
    // if (this.isDateFieldSelected) {
    if (this.responseData.obsType == 'NEW') {
      this.classification = 'B';
    } else {
      this.classification = 'BD';
    }
    // } else {
    if (this.responseData.obsType == 'NEW') {
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
      } else if (this.date == 'تم الانتهاء من إجراءاتها')
      //  else if (this.date == 'Completed') 
      {
        this.classification = 'A';
      }
    }
    // }
  }
  
  checkSelected(value :string){
    this.selectedDateString =  value;

    if(value == 'متباين الرأى بشأنها'){
      this.isDateFieldSelected = false;
    }else{
      if(value == 'تتعلق بجهات حكومية/اخرى'){
        this.isDateFieldSelected = false;
      }else{
        if(value == 'تم الانتهاء من إجراءاتها')
        {
          this.isDateFieldSelected = false;
        }else{
          this.isDateFieldSelected = true;
        }
      } 
    }
    
  }

  previousEntityDialog(): void {
    const dialogRef = this.dialog.open(PreviousEntityTypeComponent, {
      width: '450px',
      data: this.responseData
    });
    dialogRef.afterClosed().subscribe(result => {
    });
}
}
