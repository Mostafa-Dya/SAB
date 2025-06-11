import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchObservationsRoutingModule } from './search-observations-routing.module';
import { SearchObservationsComponent } from './search-observations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ObservationDetailsComponent } from '../observation-details/observation-details.component';
import { ExportComponent } from '../export/export.component';

@NgModule({
  declarations: [
    SearchObservationsComponent,
    ObservationDetailsComponent,
    ExportComponent
  ],
  imports: [
    CommonModule,
    SearchObservationsRoutingModule,
    SharedModule
  ]
})
export class SearchObservationsModule { }
