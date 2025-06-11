import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationSettingsRoutingModule } from './escalation-settings-routing.module';
import { EscalationSettingsComponent } from './escalation-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EscalationSettingsComponent],
  imports: [
    CommonModule,
    EscalationSettingsRoutingModule,
    SharedModule
  ]
})
export class EscalationSettingsModule { }
