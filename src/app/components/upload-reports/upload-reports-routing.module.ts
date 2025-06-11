import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadReportsComponent } from './upload-reports.component';

const routes: Routes = [
  {path: '', component: UploadReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadReportsRoutingModule { }
