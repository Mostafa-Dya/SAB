import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { InitialOrFinalObservationTitlesComponent } from '../initial-or-final-observation-titles/initial-or-final-observation-titles.component';
import { InitialOrFinalReportsComponent } from '../initial-or-final-reports/initial-or-final-reports.component';
import { NewOrRepeatedReportsComponent } from '../new-or-repeated-reports/new-or-repeated-reports.component';
import { ObservationDetailsComponent } from '../new-or-repeated-reports/observation-details-reports/observation-details-reports.component';
import { ReportsComponent } from './reports.component';
import { InitialOrInitialComparisonReportComponent } from '../initial-or-initial-comparison-report/initial-or-initial-comparison-report.component';

const routes: Routes = [
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }