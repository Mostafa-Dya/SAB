import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewOrRepeatedReportsComponent } from '../new-or-repeated-reports/new-or-repeated-reports.component';
import { InitialOrFinalReportsComponent } from '../initial-or-final-reports/initial-or-final-reports.component';
import { InitialOrFinalObservationTitlesComponent } from '../initial-or-final-observation-titles/initial-or-final-observation-titles.component';
import { ObservationDetailsComponent } from '../new-or-repeated-reports/observation-details-reports/observation-details-reports.component';
import { InitialOrInitialComparisonReportComponent } from '../initial-or-initial-comparison-report/initial-or-initial-comparison-report.component';

@NgModule({
  declarations: [
    ReportsComponent,
    NewOrRepeatedReportsComponent,
    InitialOrFinalReportsComponent,
    InitialOrFinalObservationTitlesComponent,
    ObservationDetailsComponent,
    InitialOrInitialComparisonReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
