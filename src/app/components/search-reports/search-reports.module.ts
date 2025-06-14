import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchReportsRoutingModule } from './search-reports-routing.module';
import { SearchReportsComponent } from './search-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SearchReportsRoutingModule,
    SharedModule,
    SearchReportsComponent,
  ],
})
export class SearchReportsModule { }
