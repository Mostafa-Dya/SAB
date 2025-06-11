import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseProgressRoutingModule } from './response-progress-routing.module';
import { ResponseProgressComponent } from './response-progress.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommanSharedModule } from 'src/app/shared/comman-shared.module';
import { ResponseProgressWorkDetailsComponent } from '../response-progress-work-details/response-progress-work-details.component';

@NgModule({
  declarations: [
    ResponseProgressComponent,
    ResponseProgressWorkDetailsComponent
  ],
  imports: [
    CommonModule,
    ResponseProgressRoutingModule,
    SharedModule,
    CommanSharedModule
  ]
})
export class ResponseProgressModule { }
