import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingObservationsDCEOComponent } from './pending-observations-dceo.component';


const routes: Routes = [
  { path: '', component: PendingObservationsDCEOComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingObservationsDCEORoutingModule { }
