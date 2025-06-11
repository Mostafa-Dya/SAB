import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendBackCommentsReportComponent } from './sendback-comments-report.component';

const routes: Routes = [
  {path: '', component: SendBackCommentsReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendBackCommentsReportRoutingModule { }
