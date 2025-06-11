import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationSettingsRoutingModule } from './observation-settings-routing.module';
import { ObservationSettingsComponent } from './observation-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditObservationComponent } from '../edit-observation/edit-observation.component';

@NgModule({
  declarations: [
    ObservationSettingsComponent,
    EditObservationComponent
  ],
  imports: [
    CommonModule,
    ObservationSettingsRoutingModule,
    SharedModule
  ]
})
export class ObservationSettingsModule { }
