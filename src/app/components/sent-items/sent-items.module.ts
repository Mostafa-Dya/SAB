import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentItemsRoutingModule } from './sent-items-routing.module';
import { SentItemsComponent } from './sent-items.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommanSharedModule } from 'src/app/shared/comman-shared.module';
import { SentItemsWorkDetailsComponent } from '../sent-items-work-details/sent-items-work-details.component';

@NgModule({
  declarations: [
    SentItemsComponent,
    SentItemsWorkDetailsComponent
  ],
  imports: [
    CommonModule,
    SentItemsRoutingModule,
    SharedModule,
    CommanSharedModule
  ]
})
export class SentItemsModule { }
