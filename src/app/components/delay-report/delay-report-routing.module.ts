import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelayReportComponent } from './delay-report.component';

const routes: Routes = [
    {path: '', component: DelayReportComponent}
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class delayReportsRoutingModule { }
  
  
  