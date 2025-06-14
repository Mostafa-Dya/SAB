import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  } from 'src/app/services/auth.guard';
import { InitialOrFinalObservationTitlesComponent } from '../initial-or-final-observation-titles/initial-or-final-observation-titles.component';
import { InitialOrFinalReportsComponent } from '../initial-or-final-reports/initial-or-final-reports.component';
import { NewOrRepeatedReportsComponent } from '../new-or-repeated-reports/new-or-repeated-reports.component';
import { ObservationDetailsComponent } from '../new-or-repeated-reports/observation-details/observation-details.component';
import { ReportsComponent } from './reports.component';
import { InitialOrInitialComparisonReportComponent } from '../initial-or-initial-comparison-report/initial-or-initial-comparison-report.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  {
    path: 'new-or-repeated-report',
    data: {
      role: 'admin'
    },
    component: NewOrRepeatedReportsComponent
  },
  {
    path: 'initial-or-final-report',
    data: {
      role: 'admin'
    },
    component: InitialOrFinalReportsComponent
  },
  // {
  //   path: 'initial-or-final-observation-titles',
  //   canActivate: [],
  //   data: {
  //     role: 'admin'
  //   },
  //   component: InitialOrFinalObservationTitlesComponent
  // },
  {
    path: 'initial-or-initial-comparison-report',
    data: {
      role: 'admin'
    },
    component: InitialOrInitialComparisonReportComponent
  },
  {
    path: 'classification-count-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../classification-count-report/classification-count-report.module').then(m => m.ClassificationCountReportModule)
  }, {
    path: 'reminders-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../reminders-report/reminders-report.module').then(m => m.RemindersReportModule)
  }, {
    path: 'sendback-comments-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../sendback-comments-report/sendback-comments-report.module').then(m => m.SendBackCommentsReportModule)
  }, {
    path: 'classification-change-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../classification-change-report/classification-change-report.module').then(m => m.ClassificationChangeReportModule)
  }, {
    path: 'delay-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../delay-report/delay-report.module').then(m => m.DelayReportModule)
  }, {
    path: 'user-list-report',
    // data: {
    //   role: 'admin'
    // },
    loadChildren: () => import('../user-list-report/user-list-report.module').then(m => m.UserListReportModule)
  }, {
    path: 'pending-observations',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../pending-observations-dceo/pending-observations-dceo.module').then(m => m.PendingObservationsDCEOModule)
  }, {
    path: 'pending-observations-report',
    // data: {
    //   role: 'admin'
    // },
    loadChildren: () => import('../pending-observations-report/pending-observations-report.module').then(m => m.PendingObservationsReportModule)
  }, {
    path: 'observations-per-department-report',
    data: {
      role: 'admin'
    },
    loadChildren: () => import('../observations-per-department-report/observations-per-department-report.module').then(m => m.ObservationsPerDepartmentReportModule)
  },{
    path:'new-or-repeated-report/observation-detail/:obsId',
    data:{
      role :'admin'
    },
    component:ObservationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }