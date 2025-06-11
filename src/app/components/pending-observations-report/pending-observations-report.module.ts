import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingObservationsReportRoutingModule } from './pending-observations-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PendingObservationsReportComponent } from './pending-observations-report.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [PendingObservationsReportComponent],
  imports: [
    CommonModule,
    PendingObservationsReportRoutingModule,
    SharedModule,
    MatMenuModule
  ]
})
export class PendingObservationsReportModule { }
