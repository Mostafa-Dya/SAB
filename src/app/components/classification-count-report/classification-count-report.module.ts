import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationCountReportRoutingModule } from './classification-count-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClassificationCountReportComponent } from './classification-count-report.component';


@NgModule({
  declarations: [ClassificationCountReportComponent],
  imports: [
    CommonModule,
    ClassificationCountReportRoutingModule,
    SharedModule
  ]
})
export class ClassificationCountReportModule { }
