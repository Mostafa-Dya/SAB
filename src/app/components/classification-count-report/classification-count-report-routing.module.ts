import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassificationCountReportComponent } from './classification-count-report.component';

const routes: Routes = [
  {path: '', component: ClassificationCountReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationCountReportRoutingModule { }
