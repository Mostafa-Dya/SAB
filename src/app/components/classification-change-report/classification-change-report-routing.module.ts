import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassificationChangeReportComponent } from './classification-change-report.component';

const routes: Routes = [
  {path: '', component: ClassificationChangeReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationChangeReportRoutingModule { }
