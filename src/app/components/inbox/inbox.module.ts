import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommanSharedModule } from 'src/app/shared/comman-shared.module';
import { WorkdetailsComponent } from '../workdetails/workdetails.component';

@NgModule({
  declarations: [
    InboxComponent,
    WorkdetailsComponent
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    SharedModule,
    CommanSharedModule
  ]
})
export class InboxModule { }
