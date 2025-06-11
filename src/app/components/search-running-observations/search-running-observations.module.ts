import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRunningObservationsRoutingModule } from './search-running-observations-routing.module';
import { SearchRunningObservationsComponent } from './search-running-observations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchRunningObservationDetailsComponent } from '../search-running-observation-details/search-running-observation-details.component';

@NgModule({
  declarations: [
    SearchRunningObservationsComponent,
    SearchRunningObservationDetailsComponent
  ],
  imports: [
    CommonModule,
    SearchRunningObservationsRoutingModule,
    SharedModule
  ]
})
export class SearchRunningObservationsModule { }
