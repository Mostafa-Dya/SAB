import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingObservationsReportComponent } from './pending-observations-report.component';


const routes: Routes = [
  { path: '', component: PendingObservationsReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingObservationsReportRoutingModule { }
