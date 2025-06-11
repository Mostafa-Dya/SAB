import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObservationsPerDepartmentReportComponent } from './observations-per-department-report.component';

const routes: Routes = [
    {path: '', component: ObservationsPerDepartmentReportComponent}
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ObservationsPerDepartmentReportsRoutingModule { }
  
  
  