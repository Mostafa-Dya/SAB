import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationComponent } from './delegation.component';

const routes: Routes = [
  {path: '', component: DelegationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationRoutingModule { }
