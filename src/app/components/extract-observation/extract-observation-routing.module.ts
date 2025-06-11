import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareObservationComponent } from '../compare-observation/compare-observation.component';
import { ExtractFinalObservationComponent } from '../extract-final-observation/extract-final-observation.component';
import { InitialFinalComparisonReportComponent } from '../initial-final-comparison-report/initial-final-comparison-report.component';
import { LinkObservationsComponent } from '../link-observations/link-observations.component';
import { ExtractObservationComponent } from './extract-observation.component';

const routes: Routes = [
  { path: '', component: ExtractObservationComponent },
  { path: 'compare-observations/:status', component: CompareObservationComponent },
  { path: 'compare-observations/:status/link-observations', component: LinkObservationsComponent },
  { path: 'compare-observations/:status/initial-final-comparison-report', component: InitialFinalComparisonReportComponent },
  { path: 'compare-observations/:status/extract-final-observation/:obsId', component: ExtractFinalObservationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractObservationRoutingModule { }
