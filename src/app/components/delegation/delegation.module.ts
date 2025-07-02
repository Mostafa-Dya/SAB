import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelegationRoutingModule } from './delegation-routing.module';
import { DelegationComponent } from './delegation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommanSharedModule } from 'src/app/shared/comman-shared.module';

@NgModule({
  declarations: [DelegationComponent],
  imports: [
    CommonModule,
    DelegationRoutingModule,
    SharedModule,
    CommanSharedModule
  ]
})
export class DelegationModule { }
