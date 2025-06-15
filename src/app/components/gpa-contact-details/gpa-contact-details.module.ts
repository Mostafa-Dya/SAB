import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GPAContactDetailsRoutingModule } from './gpa-contact-details-routing.module';
import { GPAContactDetailsComponent } from './gpa-contact-details.component';
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
