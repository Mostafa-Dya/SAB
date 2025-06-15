import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactivateDECONotificationsComponent } from './deactivate-deco-notifications.component';

const routes: Routes = [
  { path: '', component: DeactivateDECONotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeactivateDECONotificationsRoutingModule { }
