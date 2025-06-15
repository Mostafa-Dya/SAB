import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationChangeReportRoutingModule } from './classification-change-report-routing.module';
import { ClassificationChangeReportComponent } from './classification-change-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ClassificationChangeReportComponent],
  imports: [
    CommonModule,
    ClassificationChangeReportRoutingModule,
    SharedModule
  ]
})
export class ClassificationChangeReportModule { }
