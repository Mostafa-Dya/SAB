import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchRunningObservationDetailsComponent } from '../search-running-observation-details/search-running-observation-details.component';
import { SearchRunningObservationsComponent } from './search-running-observations.component';

const routes: Routes = [
  { path: '', component: SearchRunningObservationsComponent },
  { path: 'observation-details/:stepCustomId', component: SearchRunningObservationDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRunningObservationsRoutingModule { }