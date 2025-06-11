import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListReportComponent } from './user-list-report.component';

const routes: Routes = [
  { path: '', component: UserListReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserListReportRoutingModule { }
