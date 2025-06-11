import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GPAContactDetailsRoutingModule } from './g&pa-contact-details-routing.module';
import { GPAContactDetailsComponent } from './g&pa-contact-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GPAContactDetailsComponent],
  imports: [
    CommonModule,
    GPAContactDetailsRoutingModule,
    SharedModule
  ]
})
export class GPAContactDetailsModule { }
