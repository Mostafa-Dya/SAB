import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { LaunchReportsComponent } from './launch-reports.component';

const routes: Routes = [
  { path: '', component: LaunchReportsComponent },
  { path: 'change-department/:reportId', component: ChangeDepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchReportsRoutingModule { }
