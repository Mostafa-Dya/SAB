import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombineResponsesComponent } from '../combine-responses/combine-responses.component';
import { SentItemsWorkDetailsComponent } from '../sent-items-work-details/sent-items-work-details.component';
import { SentItemsComponent } from './sent-items.component';

const routes: Routes = [
  { path: '', component: SentItemsComponent },
  { path: 'combine-responses/:stepCustomId', component: CombineResponsesComponent },
  { path: 'work-item-details/:stepCustomId', component: SentItemsWorkDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentItemsRoutingModule { }
