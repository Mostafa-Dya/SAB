import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchReportsComponent } from './search-reports.component';

const routes: Routes = [
  { path: '', component: SearchReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchReportsRoutingModule { }
