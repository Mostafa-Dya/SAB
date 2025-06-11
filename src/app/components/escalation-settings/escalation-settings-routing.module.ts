import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscalationSettingsComponent } from './escalation-settings.component';

const routes: Routes = [
  { path: '', component: EscalationSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalationSettingsRoutingModule { }
