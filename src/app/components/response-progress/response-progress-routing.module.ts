import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombineResponsesComponent } from '../combine-responses/combine-responses.component';
import { ResponseProgressWorkDetailsComponent } from '../response-progress-work-details/response-progress-work-details.component';
import { ResponseProgressComponent } from './response-progress.component';

const routes: Routes = [
  { path: '', component: ResponseProgressComponent },
  { path: 'combine-responses/:stepCustomId', component: CombineResponsesComponent },
  { path: 'work-item-details/:stepCustomId', component: ResponseProgressWorkDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseProgressRoutingModule { }
