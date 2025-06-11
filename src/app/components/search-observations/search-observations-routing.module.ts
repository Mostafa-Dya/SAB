import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObservationDetailsComponent } from '../observation-details/observation-details.component';
import { SearchObservationsComponent } from './search-observations.component';

const routes: Routes = [
  { path: '', component: SearchObservationsComponent },
  { path: 'observation-details/:obsId', component: ObservationDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchObservationsRoutingModule { }
