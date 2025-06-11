import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemindersReportComponent } from './reminders-report.component';

const routes: Routes = [
  {path: '', component: RemindersReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersReportRoutingModule { }
