import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ RemindersReportComponent} from './reminders-report.component'
import { RemindersReportRoutingModule } from './reminders-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RemindersReportComponent],
  imports: [
    CommonModule,
    RemindersReportRoutingModule,
    SharedModule
  ]
})
export class RemindersReportModule { }