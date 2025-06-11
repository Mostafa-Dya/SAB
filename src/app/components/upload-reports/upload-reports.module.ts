import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadReportsRoutingModule } from './upload-reports-routing.module';
import { UploadReportsComponent } from './upload-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UploadReportsComponent],
  imports: [
    CommonModule,
    UploadReportsRoutingModule,
    SharedModule
  ]
})
export class UploadReportsModule { }
