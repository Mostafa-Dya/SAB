import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchReportsRoutingModule } from './search-reports-routing.module';
import { SearchReportsComponent } from './search-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SearchReportsComponent],
  imports: [
    CommonModule,
    SearchReportsRoutingModule,
    SharedModule
  ]
})
export class SearchReportsModule { }
