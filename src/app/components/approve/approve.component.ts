import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../assets/js/ck-editor-plugin/ckeditor';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { ConfigService } from 'src/app/services/config.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CoreService } from 'src/app/services/core.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { isArray } from 'lodash';


interface DateStrings {
  date: string;
}

export interface Entities {
  name: string;
}


interface Entitys {
  value: string;
  name: string;
}

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  public Editor = ClassicEditor;
  public model = {
    editorData: '',
    previous: ''
  };
  isRtl: any;
  @ViewChild('userFile') userFile: ElementRef;
  selectedFile: File;
  comment = '';
  displayedColumns: string[] = ['name', 'attachedBy', 'createdDate', 'action'];
  displayedColumnsMob: string[] = ['name'];
  dataSource = new MatTableDataSource<any>();
  isFileError: boolean;
  errorMessage: string;
  responseData: ObsResponse;
  dialogueType: string;
  config = {
   // toolbar: ['bold', 'underline', '|', 'bulletedList', '|', 'undo', 'redo'],
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
   toolbar: ['undo', 'redo'],
    language: 'ar'
  }
  isEditable: boolean = false;
 /** 
  entitys: Entitys[] = [
    { value: 'مساندة الإدارة', name: 'مساندة الإدارة' },
    { value: 'لجنة متابعة ملاحظات وتوصيات ديوان المحاسبة', name: 'لجنة متابعة ملاحظات وتوصيات ديوان المحاسبة' },
    { value: 'مجلس الإدارة', name: 'مجلس الإدارة' },
    { value: 'الإدارة العليا', name: 'الإدارة العليا' },
    { value: 'ديوان المحاسبة', name: 'ديوان المحاسبة' },
    { value: 'اللجنة المنبثقة', name: 'اللجنة المنبثقة' },
    { value: 'عن مجلس الإدارة', name: 'عن مجلس الإدارة' },
    { value: 'اللجنة العليا لمتابعة تنفيذ ملاحظات وتوصيات ديوان المحاسبة', name: 'اللجنة العليا لمتابعة تنفيذ ملاحظات وتوصيات ديوان المحاسبة' },
    { value: 'تعديل استثنائي من الدائرة', name: 'تعديل استثنائي من الدائرة' },
  ];
  **/
  entitys: Entitys[] = [
    { value: 'تعديلات لغوية / صياغة', name: 'تعديلات لغوية / صياغة' },
    { value: 'تم تعديل الرد من قبل الدائرة بعد مراجعة الشؤون الحكومية والبرلمانية', name: 'تم تعديل الرد من قبل الدائرة بعد مراجعة الشؤون الحكومية والبرلمانية' },
    { value: 'تم تعديل الرد بطلب من الدائرة', name: 'تم تعديل الرد بطلب من الدائرة' },
    { value: 'تم تعديل الرد بناء على طلب الإدارة العليا', name: 'تم تعديل الرد بناء على طلب الإدارة العليا' },
    { value: 'تم تعديل الرد بموجب اجتماع مجلس الإدارة', name: 'تم تعديل الرد بموجب اجتماع مجلس الإدارة' },
    { value: 'تم تعديل الرد بموجب اجتماع اللجنة والديوان', name: 'تم تعديل الرد بموجب اجتماع اللجنة والديوان' },
    { value: 'تم تعديل الرد بموجب اجتماع الإدارة العليا واللجنة', name: 'تم تعديل الرد بموجب اجتماع الإدارة العليا واللجنة' },
    { value: 'تم تعديل الرد حسب طلب الديوان', name: 'تم تعديل الرد حسب طلب الديوان' },
    { value: 'Other', name: 'Other' },
  ];
  selectedEntity: string;
  reson = '';
  userInformation: any;
  isAdmin: any;
  reportCycle: string;
  date = '';
  fiscaalYear: any[] = [];
  isDateFieldSelected = true;
  dateStrings: DateStrings[] = [
    { date: 'متباين الرأى بشأنها' },
    { date: 'تتعلق بجهات حكومية/اخرى' },
    { date: 'تم الانتهاء من إجراءاتها' }
  ];
  selectedDateString: string;
  mainUrl: string;
  stepUniqueName: any;
  isPredefined: boolean = false;
  isSkipMail: boolean = true;
  approveEnabled: any;
  classification: string;
  govtEntity: string = '';
  userId: string;
  isPreviouseDataPresent: boolean = false;
  sendBackCount: number;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  entities: any = [];

  constructor(
    public dialogRef: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private _loading: LoadingService,
    public dialog: MatDialog,
    private coreService: CoreService,
    private notification: NzNotificationService
  ) {
    this.responseData = data.responseData;
    if (this.responseData.hasOwnProperty('prevCompletionYear') && this.responseData.prevCompletionYear != '') {
      this.isPreviouseDataPresent = true;
    }

    this.dialogueType = data.dialogueType;
    dialogRef.disableClose = true;
    if (this.responseData.obsResponse) {
      setTimeout(() => this.model.editorData = this.responseData.obsResponse, 200);
    }
    if (this.responseData.attachmens) {
      this.dataSource.data = this.responseData.attachmens;
    }
  }

  async ngOnInit() {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    if (this.responseData.isEditable == undefined) {
      this.isEditable = false;
    } else {
      this.isEditable = this.responseData.isEditable;
    }
    this.reportCycle = this.responseData.reportCycle;
    this.stepUniqueName = this.responseData.stepUniqueName;
    if(this.stepUniqueName =='NORMAL-DCEO-OR-CEO-APPROVAL'){
    this.sendBackCount = this.data.responseData.gpaSendBackCount;
    }
    this.approveEnabled = this.responseData.approveEnabled;
    // this.selectedDateString = this.dateStrings[0].date;
    // this.date = this.selectedDateString;
    if (this.responseData.completionYear) {
      this.date = this.responseData.completionYear;
      this.dateChange();
      this.checkSelected(this.date)
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

    if (this.responseData.govtEntity) {
      this.entities = this.responseData.govtEntity.split(',');
      // this.govtEntity = this.responseData.govtEntity;
    }
    this.selectedEntity = this.entitys[0].value;
    this.userId = localStorage.getItem('loginId') || '';
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.mainUrl = this.configService.baseUrl;;
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

  onApprove(): void {
    if(isArray(this.entities)){
      this.entities = this.entities.filter((item: any) => {
        return item.trim();
      })
    }  
    if (this.isFileError) {
      return;
    } else {
      let approveData;
      if (this.reportCycle != 'KNPC Response Report') {
        let completionYear;
        // if (this.isDateFieldSelected) {
        completionYear = this.date;
        // } else {
        //   completionYear = this.selectedDateString;
        // }
        if (completionYear == 'تتعلق بجهات حكومية/اخرى') {
          if (this.isEditable) {
            if (this.approveEnabled) {
              approveData = {
                editorData: this.model.editorData,
                reson: this.reson.trim(),
                entity: this.selectedEntity,
                completionYear: completionYear,
                classification: this.classification,
                govtEntity: this.entities.join(','),
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            } else {
              approveData = {
                editorData: this.model.editorData,
                reson: this.reson.trim(),
                classification: this.classification,
                entity: this.selectedEntity,
                completionYear: completionYear,
                govtEntity: this.entities.join(','),
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            }
          } else {
            if (this.approveEnabled) {
              approveData = {
                editorData: this.model.editorData,
                comment: this.comment.trim(),
                completionYear: completionYear,
                classification: this.classification,
                govtEntity:this.entities.join(','),
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            } else {
              approveData = {
                editorData: this.model.editorData,
                comment: this.comment.trim(),
                completionYear: completionYear,
                classification: this.classification,
                govtEntity: this.entities.join(','),
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            }
          }
        } else {
          if (this.isEditable) {
            if (this.approveEnabled) {
              approveData = {
                editorData: this.model.editorData,
                reson: this.reson.trim(),
                entity: this.selectedEntity,
                completionYear: completionYear,
                classification: this.classification,
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            } else {
              approveData = {
                editorData: this.model.editorData,
                reson: this.reson.trim(),
                entity: this.selectedEntity,
                completionYear: completionYear,
                isSkipMail: this.isSkipMail,
                classification: this.classification,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            }
          } else {
            if (this.approveEnabled) {
              approveData = {
                editorData: this.model.editorData,
                comment: this.comment.trim(),
                completionYear: completionYear,
                classification: this.classification,
                isSkipMail: this.isSkipMail,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            } else {
              approveData = {
                editorData: this.model.editorData,
                comment: this.comment.trim(),
                completionYear: completionYear,
                isSkipMail: this.isSkipMail,
                classification: this.classification,
                attach: this.selectedFile,
                attachmentName: this.selectedFile?.name
              }
            }
          }
        }
      } else {
        if (this.isEditable) {
          approveData = {
            editorData: this.model.editorData,
            reson: this.reson.trim(),
            entity: this.selectedEntity,
            isSkipMail: this.isSkipMail,
            attach: this.selectedFile,
            // classification: this.classification,
            attachmentName: this.selectedFile?.name
          }
        } else {
          approveData = {
            editorData: this.model.editorData,
            comment: this.comment.trim(),
            isSkipMail: this.isSkipMail,
            attach: this.selectedFile,
            attachmentName: this.selectedFile?.name
          }
        }
  
      }
      this.dialogRef.close({ event: 'Send', data: approveData });
      
    }
  }

  onDraft() {
    let approveData = {
      editorData: this.model.editorData,
      completionYear: this.reportCycle != 'KNPC Response Report' ? this.date : ''
    }
    this.dialogRef.close({ event: 'draft', data: approveData });
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

  downloadAttachment(docId: any) {
    let url = 'DownloadController/downloadAttachByDocId?DocId=' + docId;
    window.open(this.mainUrl + url, '_parent');
  }

  deleteAttachment(docId: any, index: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DELETE',
        dialogMessage: 'ARE_YOU_SURE_DELETE_ATTACHMENT'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Send') {
        this._onDeleteAttachment(docId, index);
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
      console.log('error :', error);
    });
  }

  predefiengChange() {
    if (this.isPredefined) {
      this.model.editorData = this.model.editorData + '<div>تفيد الشركة بتأكيد ما جاء بردها السابق</div>';
    } else {
      this.model.editorData = this.responseData.obsResponse;
    }
  }

  // onPaste(e: any) {
  //   e.preventDefault();
  //   return false;
  // };

  // onReady(editor: any) {
  //   const documentView = editor.editing.view.document;
  //   documentView.on("paste", (event: any, data: any) => {
  //     event.stop();
  //     // event.cancel(); // Uncaught CKEditorError: event.cancel is not a function
  //     // event.preventDefault(); // Uncaught CKEditorError: event.preventDefault is not a function
  //     return false;
  //   });
  // }  

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

  change(editorData: string) {
    if (editorData.includes("<table>")) {
      setTimeout(() => {
        this.model.editorData = this.model.previous;
        this.notification.create('info', 'Info', "Table is not allowed to add or paste here");
      })
    } else {
      if (editorData.includes("<img")) {
        setTimeout(() => {
          this.model.editorData = this.model.previous;
          this.notification.create('info', 'Info', "Image is not allowed to add or paste here");
        })
      } else if (editorData.includes("<ul>") || editorData.includes("<ol>")) {
        setTimeout(() => {
          this.model.editorData = this.model.previous;
          this.notification.create('info', 'Info', "Bullet points are not allowed to add or paste here");
        });
      }else if (editorData.includes("<u>") || editorData.includes("<b>") || editorData.includes("<strong>")) {
        setTimeout(() => {
          this.model.editorData = this.model.previous;
          this.notification.create('info', 'Info', "Underline and bold text are not allowed to add or paste here");
        });
      } else {
        this.model.previous = this.model.editorData
      }
    }
  }

  checkSelected(value: string) {
    this.selectedDateString = value;

    if (value == 'متباين الرأى بشأنها') {
      this.isDateFieldSelected = false;
    } else {
      if (value == 'تتعلق بجهات حكومية/اخرى') {
        this.isDateFieldSelected = false;
      } else {
        if (value == 'تم الانتهاء من إجراءاتها') {
          this.isDateFieldSelected = false;
        } else {
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
