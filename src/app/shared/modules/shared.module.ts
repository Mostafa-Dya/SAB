import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule,
    TranslateModule,
    NzDatePickerModule,
    NzAlertModule,
    NzSelectModule,
    NzNotificationModule,
    MatMenuModule,
    RouterModule,
    MatInputModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule,
    TranslateModule,
    SafeHtmlPipe,
    NzDatePickerModule,
    NzAlertModule,
    NzSelectModule,
    NzNotificationModule,
    MatMenuModule,
    RouterModule,
    MatInputModule,
  ],
})
export class SharedModule {}
