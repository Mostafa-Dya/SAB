import { NgModule } from '@angular/core';
import { DelayReportComponent } from './delay-report.component';
import { delayReportsRoutingModule } from './delay-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DelayReportComponent],
  imports: [
    CommonModule,
    delayReportsRoutingModule,
    SharedModule
  ]
})
export class DelayReportModule { }  