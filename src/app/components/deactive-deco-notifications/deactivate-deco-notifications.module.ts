import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeactivateDECONotificationsRoutingModule } from './deactivate-deco-notifications-routing.module';
import { DeactivateDECONotificationsComponent } from './deactivate-deco-notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DeactivateDECONotificationsComponent],
  imports: [
    CommonModule,
    DeactivateDECONotificationsRoutingModule,
    SharedModule
  ]
})
export class DeactivateDECONotificationsModule { }
