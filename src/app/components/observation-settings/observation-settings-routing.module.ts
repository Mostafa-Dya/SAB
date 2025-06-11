import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditObservationComponent } from '../edit-observation/edit-observation.component';
import { ObservationSettingsComponent } from './observation-settings.component';

const routes: Routes = [
  { path: '', component: ObservationSettingsComponent },
  { path: 'edit-observation/:obsId', component: EditObservationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservationSettingsRoutingModule { }
