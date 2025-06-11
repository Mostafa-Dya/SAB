import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ SendBackCommentsReportComponent} from './sendback-comments-report.component'
import { SendBackCommentsReportRoutingModule } from './sendback-comments-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SendBackCommentsReportComponent],
  imports: [
    CommonModule,
    SendBackCommentsReportRoutingModule,
    SharedModule
  ]
})
export class SendBackCommentsReportModule { }