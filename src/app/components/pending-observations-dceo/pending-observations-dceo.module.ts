import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingObservationsDCEORoutingModule } from './pending-observations-dceo-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PendingObservationsDCEOComponent } from './pending-observations-dceo.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [PendingObservationsDCEOComponent],
  imports: [
    CommonModule,
    PendingObservationsDCEORoutingModule,
    SharedModule,
    MatMenuModule
  ]
})
export class PendingObservationsDCEOModule { }
