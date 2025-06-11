import { CommonModule, LowerCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';

import { ConfigService } from '../../services/config.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { environment } from '../../../environments/environment';

interface DateString {
  date: string;
}
interface EntityOption {
  value: string;
  name: string;
}

@Component({
  selector: 'app-approve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatTooltipModule,
    NzAlertModule,
    TranslateModule,
    SafeHtmlPipe,
    TextFieldModule,
    CKEditorModule,
  ],
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnInit {
  public model = { editorData: '', previous: '' };
  entities: string[] = [];

  config = {
    toolbar: ['undo', 'redo'],
    language: 'ar',
    fontFamily: {
      options: ['Times New Roman, Times, serif'],
      supportAllValues: false,
    },
    fontSize: { options: [12], supportAllValues: false },
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // RTL & display flags
  isRtl = false;
  isEditable = false;
  isAdmin = false;
  approveEnabled = false;

  // form state
  responseData!: any;
  dialogueType = '';
  reportCycle = '';
  stepUniqueName = '';
  sendBackCount = 0;
  date = '';
  selectedDateString = '';
  classification = '';
  fiscaalYear: DateString[] = [];
  dateStrings: DateString[] = [
    { date: 'متباين الرأى بشأنها' },
    { date: 'تتعلق بجهات حكومية/اخرى' },
    { date: 'تم الانتهاء من إجراءاتها' },
  ];

  // reason options
  entitys: EntityOption[] = [
    { value: 'تعديلات لغوية / صياغة', name: 'تعديلات لغوية / صياغة' },
    {
      value:
        'تم تعديل الرد من قبل الدائرة بعد مراجعة الشؤون الحكومية والبرلمانية',
      name: 'تم تعديل الرد من قبل الدائرة بعد مراجعة الشؤون الحكومية والبرلمانية',
    },
    {
      value: 'تم تعديل الرد بطلب من الدائرة',
      name: 'تم تعديل الرد بطلب من الدائرة',
    },
    {
      value: 'تم تعديل الرد بناء على طلب الإدارة العليا',
      name: 'تم تعديل الرد بناء على طلب الإدارة العليا',
    },
    {
      value: 'تم تعديل الرد بموجب اجتماع مجلس الإدارة',
      name: 'تم تعديل الرد بموجب اجتماع مجلس الإدارة',
    },
    {
      value: 'تم تعديل الرد بموجب اجتماع اللجنة والديوان',
      name: 'تم تعديل الرد بموجب اجتماع اللجنة والديوان',
    },
    {
      value: 'تم تعديل الرد بموجب اجتماع الإدارة العليا واللجنة',
      name: 'تم تعديل الرد بموجب اجتماع الإدارة العليا واللجنة',
    },
    {
      value: 'تم تعديل الرد حسب طلب الديوان',
      name: 'تم تعديل الرد حسب طلب الديوان',
    },
    { value: 'Other', name: 'Other' },
  ];

  selectedEntity = this.entitys[0]?.value || '';
  govtEntity = '';

  // checkboxes
  isPredefined = false;
  isSkipMail = true;

  // file attachment
  selectedFile?: File;
  isFileError = false;
  errorMessage = '';

  // comments
  comment = '';
  reson = '';

  // table
  displayedColumns = ['name', 'attachedBy', 'createdDate', 'action'];
  displayedColumnsMob = ['name'];
  dataSource = new MatTableDataSource<any>();

  private mainUrl = '';

  constructor(
    private dialogRef: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private loading: LoadingService,
    private coreService: CoreService,
    private notification: NzNotificationService,
    private dialog: MatDialog
  ) {
    this.responseData = data.responseData;
    this.dialogueType = data.dialogueType;
    this.dialogRef.disableClose = true;

    if (this.responseData.obsResponse) {
      setTimeout(
        () => (this.model.editorData = this.responseData.obsResponse),
        0
      );
    }
    if (this.responseData.attachmens) {
      this.dataSource.data = this.responseData.attachmens;
    }
    this.stepUniqueName = this.responseData.stepUniqueName;
    this.sendBackCount = this.responseData.gpaSendBackCount ?? 0;
  }

  async ngOnInit() {
    this.sharedVariableService.isRtl$.subscribe((v) => (this.isRtl = v));

    this.isEditable = !!this.responseData.isEditable;
    this.isAdmin = JSON.parse(
      localStorage.getItem('sabUserInformation') || '{}'
    ).admin;
    this.approveEnabled = !!this.responseData.approveEnabled;
    this.reportCycle = this.responseData.reportCycle;

    this.mainUrl = environment.baseUrl;

    const reportYear = Number(
      JSON.parse(
        localStorage.getItem('sabUserInformation') || '{}'
      ).reportYear.split('-')[0]
    );
    this.fiscaalYear = [
      ...this.dateStrings,
      ...(await this.sharedVariableService.getYears(reportYear)),
    ];

    if (this.responseData.completionYear) {
      this.date = this.responseData.completionYear;
      this.setClassification();
      this.checkSelected(this.date);
    } else {
      this.setClassification();
    }

    if (this.responseData.govtEntity) {
      this.entities = this.responseData.govtEntity.split(',');
    }
  }

  // Chips
  addChip() {
    const v = this.govtEntity.trim();
    if (v) this.entities.push(v);
    this.govtEntity = '';
  }
  remove(item: string) {
    this.entities = this.entities.filter((e) => e !== item);
  }

  // Date & classification
  dateChange() {
    this.setClassification();
  }
  checkSelected(val: string) {
    this.selectedDateString = val;
  }
  private setClassification() {
    const base = this.responseData.obsType === 'NEW' ? 'B' : 'BD';
    switch (this.date) {
      case 'متباين الرأى بشأنها':
        this.classification = this.responseData.obsType === 'NEW' ? 'C' : 'CD';
        break;
      case 'تتعلق بجهات حكومية/اخرى':
        this.classification = this.responseData.obsType === 'NEW' ? 'E' : 'ED';
        break;
      case 'تم الانتهاء من إجراءاتها':
        this.classification = 'A';
        break;
      default:
        this.classification = base;
    }
  }

  // Predefined snippet
  predefiengChange() {
    if (this.isPredefined) {
      this.model.editorData +=
        '<div>تفيد الشركة بتأكيد ما جاء بردها السابق</div>';
    } else {
      this.model.editorData = this.responseData.obsResponse;
    }
  }

  // CKEditor filter
  change(data: string) {
    const forbidden = [
      '<table>',
      '<img',
      '<ul>',
      '<ol>',
      '<u>',
      '<b>',
      '<strong>',
    ];
    if (forbidden.some((f) => data.includes(f))) {
      setTimeout(() => {
        this.model.editorData = this.model.previous;
        this.notification.info('Info', 'That content isn’t allowed here');
      });
    } else {
      this.model.previous = data;
    }
  }

  // File attach
  triggerFileSelect() {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()!.toLowerCase();
    const ok = this.isAdmin ? ['pdf', 'doc', 'docx', 'msg'] : ['pdf'];
    if (!ok.includes(ext)) {
      this.isFileError = true;
      this.errorMessage = this.isAdmin ? 'ALLOWED_FILE' : 'ONLY_PDF';
    } else if (file.size > 5 * 1024 * 1024) {
      this.isFileError = true;
      this.errorMessage = 'FILE_SIZE_5MB';
    } else {
      this.isFileError = false;
      this.selectedFile = file;
    }
  }
  clearSelectedFile() {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = undefined;
  }

  // Download/Delete
  downloadAttachment(docId: string) {
    window.open(
      `${this.mainUrl}DownloadController/downloadAttachByDocId?DocId=${docId}`,
      '_blank'
    );
  }
  deleteAttachment(docId: string, idx: number) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DELETE',
        dialogMessage: 'ARE_YOU_SURE_DELETE_ATTACHMENT',
      },
    });
    ref.afterClosed().subscribe((res) => {
      if (res.event === 'Send') this._removeAttachment(docId, idx);
    });
  }
  private _removeAttachment(docId: string, idx: number) {
    const url = `launchObservations/deleteAttachment?docId=${docId}`;

    // tell coreService.get() that we expect { message: string }
    this.loading.setLoading(true, url);
    this.coreService
      .get<{ message: string }>(url) // ← here
      .subscribe({
        next: (resp) => {
          this.loading.setLoading(false, url);

          // now TS knows resp.message is a string
          const d = this.dataSource.data;
          d.splice(idx, 1);
          this.dataSource.data = d;

          this.notification.success('Success', resp.message);
        },
        error: (err) => {
          this.loading.setLoading(false, url);
          this.notification.error('Error', err);
        },
      });
  }

  // Submit
  onApprove() {
    if (this.isFileError) return;
    const common: any = {
      editorData: this.model.editorData,
      isSkipMail: this.isSkipMail,
      attach: this.selectedFile,
      attachmentName: this.selectedFile?.name,
    };
    let payload: any = { ...common };
    if (this.reportCycle !== 'KNPC Response Report') {
      payload.completionYear = this.date;
      payload.classification = this.classification;
      if (this.date === 'تتعلق بجهات حكومية/اخرى')
        payload.govtEntity = this.entities.join(',');
      if (this.isEditable) payload.reson = this.reson.trim();
      else payload.comment = this.comment.trim();
    } else {
      if (this.isEditable) payload.reson = this.reson.trim();
      else payload.comment = this.comment.trim();
    }
    this.dialogRef.close({ event: 'Send', data: payload });
  }
  onDraft() {
    this.dialogRef.close({
      event: 'draft',
      data: { editorData: this.model.editorData, completionYear: this.date },
    });
  }
  previousEntityDialog() {
    this.dialog.open(PreviousEntityTypeComponent, {
      width: '450px',
      data: this.responseData,
    });
  }
}
