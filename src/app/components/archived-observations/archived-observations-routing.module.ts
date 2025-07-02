import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivedObservationDetailsComponent } from '../archived-observation-details/archived-observation-details.component';
import { ArchivedObservationsComponent } from './archived-observations.component';

const routes: Routes = [
  { path: '', component: ArchivedObservationsComponent },
  { path: 'observation-details/:obsId', component: ArchivedObservationDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivedObservationsRoutingModule { }