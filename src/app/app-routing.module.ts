import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  PreloadingStrategy,
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { ArchiveComponent } from './components/archive/archive.component';
import { ArchivedObservationDetailsComponent } from './components/archived-observation-details/archived-observation-details.component';
import { ArchivedObservationsComponent } from './components/archived-observations/archived-observations.component';
import { ObservationDetailsReportComponent } from './components/new-or-repeated-reports/observation-details-reports/observation-details-reports.component';
import { ObservationsPerDepartmentReportComponent } from './components/observations-per-department-report/observations-per-department-report.component';
import { PendingObservationsReportComponent } from './components/pending-observations-report/pending-observations-report.component';
import { ClassificationCountReportComponent } from './components/classification-count-report/classification-count-report.component';
import { ClassificationChangeReportComponent } from './components/classification-change-report/classification-change-report.component';
import { DelayReportComponent } from './components/delay-report/delay-report.component';
import { InitialOrFinalReportsComponent } from './components/initial-or-final-reports/initial-or-final-reports.component';
import { InitialOrInitialComparisonReportComponent } from './components/initial-or-initial-comparison-report/initial-or-initial-comparison-report.component';
import { NewOrRepeatedReportsComponent } from './components/new-or-repeated-reports/new-or-repeated-reports.component';
import { PendingObservationsDCEOComponent } from './components/pending-observations-dceo/pending-observations-dceo.component';
import { RemindersReportComponent } from './components/reminders-report/reminders-report.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SendBackCommentsReportComponent } from './components/sendback-comments-report/sendback-comments-report.component';
import { UserListReportComponent } from './components/user-list-report/user-list-report.component';
import { DeactivateDECONotificationsComponent } from './components/deactive-deco-notifications/deactivate-deco-notifications.component';
import { DelegationComponent } from './components/delegation/delegation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full',
    // loadChildren: () => import('./components/inbox/inbox.module').then(m => m.InboxModule)
  },
  {
    path: 'inbox',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/inbox/inbox.module').then((m) => m.InboxModule),
  },
  {
    path: 'sent-items',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/sent-items/sent-items.module').then(
        (m) => m.SentItemsModule
      ),
  },
  {
    path: 'archive',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ArchiveComponent,
  },
  {
    path: 'launchReports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/launch-reports/launch-reports.module').then(
        (m) => m.LaunchReportsModule
      ),
  },
  {
    path: 'extractReports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import(
        './components/extract-observation/extract-observation.module'
      ).then((m) => m.ExtractObservationModule),
  },
  {
    path: 'response-progress',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/response-progress/response-progress.module').then(
        (m) => m.ResponseProgressModule
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'observation-settings',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import(
        './components/observation-settings/observation-settings.module'
      ).then((m) => m.ObservationSettingsModule),
  },
  {
    path: 'search-observations',
    loadChildren: () =>
      import(
        './components/search-observations/search-observations.module'
      ).then((m) => m.SearchObservationsModule),
  },
  {
    path: 'running-observations',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import(
        './components/search-running-observations/search-running-observations.module'
      ).then((m) => m.SearchRunningObservationsModule),
  },
  {
    path: 'archived-observations',
    canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    component: ArchivedObservationsComponent,
  },
  {
    path: 'search-reports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/search-reports/search-reports.module').then(
        (m) => m.SearchReportsModule
      ),
  },
  {
    path: 'upload-reports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/upload-reports/upload-reports.module').then(
        (m) => m.UploadReportsModule
      ),
  },
  {
    path: 'delegation',
    canActivate: [AuthGuard],
    data: {
      role: 'SEC',
    },
    component: DelegationComponent,
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    loadChildren: () =>
      import('./components/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },
  {
    path: 'escalation-settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './components/escalation-settings/escalation-settings.module'
      ).then((m) => m.EscalationSettingsModule),
  },
  {
    path: 'contact-detail',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './components/g&pa-contact-details/g&pa-contact-details.module'
      ).then((m) => m.GPAContactDetailsModule),
  },
  {
    path: 'deactive-deco-notification',
    canActivate: [AuthGuard],
    component: DeactivateDECONotificationsComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./components/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'observation-details/:obsId',
    component: ArchivedObservationDetailsComponent,
  },

  { path: '', component: ReportsComponent },
  {
    path: 'new-or-repeated-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: NewOrRepeatedReportsComponent,
  },
  {
    path: 'initial-or-final-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: InitialOrFinalReportsComponent,
  },
  // {
  //   path: 'initial-or-final-observation-titles',
  //   canActivate: [AuthGuard],
  //   data: {
  //     role: 'admin'
  //   },
  //   component: InitialOrFinalObservationTitlesComponent
  // },
  {
    path: 'initial-or-initial-comparison-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: InitialOrInitialComparisonReportComponent,
  },
  {
    path: 'classification-count-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: ClassificationCountReportComponent,
  },
  {
    path: 'reminders-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: RemindersReportComponent,
  },
  {
    path: 'sendback-comments-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: SendBackCommentsReportComponent,
  },
  {
    path: 'classification-change-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: ClassificationChangeReportComponent,
  },
  {
    path: 'delay-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: DelayReportComponent,
  },
  {
    path: 'user-list-report',
    // data: {
    //   role: 'admin'
    // },
    canActivate: [AuthGuard],

    component: UserListReportComponent,
  },
  {
    path: 'pending-observations',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },

    component: PendingObservationsDCEOComponent,
  },
  {
    path: 'pending-observations-report',
    canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    component: PendingObservationsReportComponent,
  },
  {
    path: 'observations-per-department-report',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ObservationsPerDepartmentReportComponent,
  },
  {
    path: 'new-or-repeated-report/observation-detail/:obsId',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ObservationDetailsReportComponent,
  },

  // {path: '401', loadChildren: () => import('./components/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)},
  // {path: '**', redirectTo: '/401'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
