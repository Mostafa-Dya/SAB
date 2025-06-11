import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GPAContactDetailsComponent } from './g&pa-contact-details.component';

const routes: Routes = [
  { path: '', component: GPAContactDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GPAContactDetailsRoutingModule { }
