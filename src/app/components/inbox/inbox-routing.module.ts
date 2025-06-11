import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombineResponsesComponent } from '../combine-responses/combine-responses.component';
import { WorkdetailsComponent } from '../workdetails/workdetails.component';
import { InboxComponent } from './inbox.component';

const routes: Routes = [
  { path: '', component: InboxComponent },
  { path: 'combine-responses/:stepCustomId', component: CombineResponsesComponent },
  { path: 'work-item-details/:stepCustomId', component: WorkdetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
