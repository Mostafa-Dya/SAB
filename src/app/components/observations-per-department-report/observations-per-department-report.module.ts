import { NgModule } from '@angular/core';
import { ObservationsPerDepartmentReportComponent } from './observations-per-department-report.component';
import { ObservationsPerDepartmentReportsRoutingModule } from './observations-per-department-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ObservationsPerDepartmentReportComponent],
    imports: [
      CommonModule,
      ObservationsPerDepartmentReportsRoutingModule,
      SharedModule
    ]
  })
  export class ObservationsPerDepartmentReportModule { }
  