import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaunchReportsRoutingModule } from './launch-reports-routing.module';
import { ExtractionCompleteDialogComponent, LaunchReportsComponent } from './launch-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { UpdateDepartmentsComponent } from '../update-departments/update-departments.component';
import { CommanSharedModule } from 'src/app/shared/comman-shared.module';
import { ChangeDepartmentInfoDialogComponent } from '../change-department-info-dialog/change-department-info-dialog.component';

@NgModule({
  declarations: [ 
    LaunchReportsComponent, 
    ChangeDepartmentComponent,
    UpdateDepartmentsComponent,
    ExtractionCompleteDialogComponent,
    ChangeDepartmentInfoDialogComponent
  ],
  imports: [
    CommonModule,
    LaunchReportsRoutingModule,
    SharedModule,
    CommanSharedModule
  ]
})
export class LaunchReportsModule { }
