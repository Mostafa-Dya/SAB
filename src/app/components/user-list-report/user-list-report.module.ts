import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListReportRoutingModule } from './user-list-report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListReportComponent } from './user-list-report.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [UserListReportComponent],
  imports: [
    CommonModule,
    UserListReportRoutingModule,
    SharedModule,
    MatMenuModule
  ]
})
export class UserListReportModule { }
