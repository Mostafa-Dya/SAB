import { Routes } from '@angular/router';
import { ArchiveComponent } from './components/archive/archive.component';
import { ArchivedObservationDetailsComponent } from './components/archived-observation-details/archived-observation-details.component';
import { ArchivedObservationsComponent } from './components/archived-observations/archived-observations.component';
import { ChangeDepartmentComponent } from './components/change-department/change-department.component';
import { ClassificationChangeReportComponent } from './components/classification-change-report/classification-change-report.component';
import { ClassificationCountReportComponent } from './components/classification-count-report/classification-count-report.component';
import { CombineResponsesComponent } from './components/combine-responses/combine-responses.component';
import { CompareObservationComponent } from './components/compare-observation/compare-observation.component';
import { DeactivateDECONotificationsComponent } from './components/deactive-deco-notifications/deactivate-deco-notifications.component';
import { DelayReportComponent } from './components/delay-report/delay-report.component';
import { DelegationComponent } from './components/delegation/delegation.component';
import { EditObservationComponent } from './components/edit-observation/edit-observation.component';
import { EscalationSettingsComponent } from './components/escalation-settings/escalation-settings.component';
import { ExtractFinalObservationComponent } from './components/extract-final-observation/extract-final-observation.component';
import { ExtractObservationComponent } from './components/extract-observation/extract-observation.component';
import { GPAContactDetailsComponent } from './components/g&pa-contact-details/g&pa-contact-details.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { InitialFinalComparisonReportComponent } from './components/initial-final-comparison-report/initial-final-comparison-report.component';
import { InitialOrFinalReportsComponent } from './components/initial-or-final-reports/initial-or-final-reports.component';
import { InitialOrInitialComparisonReportComponent } from './components/initial-or-initial-comparison-report/initial-or-initial-comparison-report.component';
import { LaunchReportsComponent } from './components/launch-reports/launch-reports.component';
import { LinkObservationsComponent } from './components/link-observations/link-observations.component';
import { NewOrRepeatedReportsComponent } from './components/new-or-repeated-reports/new-or-repeated-reports.component';
import { ObservationDetailsReportComponent } from './components/new-or-repeated-reports/observation-details-reports/observation-details-reports.component';
import { ObservationDetailsComponent } from './components/observation-details/observation-details.component';
import { ObservationSettingsComponent } from './components/observation-settings/observation-settings.component';
import { ObservationsPerDepartmentReportComponent } from './components/observations-per-department-report/observations-per-department-report.component';
import { PendingObservationsDCEOComponent } from './components/pending-observations-dceo/pending-observations-dceo.component';
import { PendingObservationsReportComponent } from './components/pending-observations-report/pending-observations-report.component';
import { RemindersReportComponent } from './components/reminders-report/reminders-report.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ResponseProgressWorkDetailsComponent } from './components/response-progress-work-details/response-progress-work-details.component';
import { ResponseProgressComponent } from './components/response-progress/response-progress.component';
import { SearchObservationsComponent } from './components/search-observations/search-observations.component';
import { SearchReportsComponent } from './components/search-reports/search-reports.component';
import { SearchRunningObservationDetailsComponent } from './components/search-running-observation-details/search-running-observation-details.component';
import { SearchRunningObservationsComponent } from './components/search-running-observations/search-running-observations.component';
import { SendBackCommentsReportComponent } from './components/sendback-comments-report/sendback-comments-report.component';
import { SentItemsWorkDetailsComponent } from './components/sent-items-work-details/sent-items-work-details.component';
import { SentItemsComponent } from './components/sent-items/sent-items.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UploadReportsComponent } from './components/upload-reports/upload-reports.component';
import { UserListReportComponent } from './components/user-list-report/user-list-report.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full',
    // loadChildren: () => import('./components/inbox/inbox.module').then(m => m.InboxModule)
  },
  {
    path: 'inbox',
    // canActivate: [AuthGuard],
    component: InboxComponent,
  },
  {
    path: 'combine-responses/:stepCustomId',
    // canActivate: [AuthGuard],
    component: CombineResponsesComponent,
  },
  {
    path: 'sent-items',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: SentItemsComponent,
  },
  {
    path: 'work-item-details/:stepCustomId',
    component: SentItemsWorkDetailsComponent,
    data: {
      role: 'admin',
    },
  },
  {
    path: 'archive',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ArchiveComponent,
  },
  {
    path: 'launchReports',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: LaunchReportsComponent,
  },
  {
    path: 'change-department/:reportId',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ChangeDepartmentComponent,
  },
  {
    path: 'extractReports',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ExtractObservationComponent,
  },
  {
    path: 'compare-observations/:status',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: CompareObservationComponent,
  },
  {
    path: 'compare-observations/:status/link-observations',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: LinkObservationsComponent,
  },
  {
    path: 'compare-observations/:status/initial-final-comparison-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: InitialFinalComparisonReportComponent,
  },
  {
    path: 'compare-observations/:status/extract-final-observation/:obsId',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ExtractFinalObservationComponent,
  },
  {
    path: 'response-progress',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ResponseProgressComponent,
  },
  {
    path: 'work-item-details/:stepCustomId',
    component: ResponseProgressWorkDetailsComponent,
  },
  {
    path: 'settings',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: SettingsComponent,
  },
  {
    path: 'observation-settings',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ObservationSettingsComponent,
  },
  {
    path: 'edit-observation/:obsId',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: EditObservationComponent,
  },
  {
    path: 'search-observations',
    component: SearchObservationsComponent,
  },
  {
    path: 'observation-details/:obsId',
    component: ObservationDetailsComponent,
  },
  {
    path: 'running-observations',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: SearchRunningObservationsComponent,
  },
  {
    path: 'observation-details/:stepCustomId',
    component: SearchRunningObservationDetailsComponent,
    data: {
      role: 'admin',
    },
  },
  {
    path: 'archived-observations',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    component: ArchivedObservationsComponent,
  },
  {
    path: 'search-reports',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: SearchReportsComponent,
  },
  {
    path: 'upload-reports',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: UploadReportsComponent,
  },
  {
    path: 'delegation',
    // canActivate: [AuthGuard],
    data: {
      role: 'SEC',
    },
    component: DelegationComponent,
  },
  {
    path: 'reports',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    component: ReportsComponent,
  },
  {
    path: '',
    component: ResponseProgressComponent,
  },
  {
    path: 'combine-responses/:stepCustomId',
    component: CombineResponsesComponent,
    // // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
  },
  {
    path: 'work-item-details/:stepCustomId',
    component: ResponseProgressWorkDetailsComponent,
  },
  {
    path: 'escalation-settings',
    // canActivate: [AuthGuard],
    component: EscalationSettingsComponent,
  },
  {
    path: 'contact-detail',
    // canActivate: [AuthGuard],
    component: GPAContactDetailsComponent,
  },
  {
    path: 'deactive-deco-notification',
    // canActivate: [AuthGuard],
    component: DeactivateDECONotificationsComponent,
  },
  {
    path: 'users',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: UsersComponent,
  },
  {
    path: 'observation-details/:obsId',
    component: ArchivedObservationDetailsComponent,
  },
  {
    path: '',
    component: ReportsComponent,
  },
  {
    path: 'new-or-repeated-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: NewOrRepeatedReportsComponent,
  },
  {
    path: 'initial-or-final-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: InitialOrFinalReportsComponent,
  },
  // {
  //   path: 'initial-or-final-observation-titles',
  //   // canActivate: [AuthGuard],
  //   data: {
  //     role: 'admin'
  //   },
  //   component: InitialOrFinalObservationTitlesComponent
  // },
  {
    path: 'initial-or-initial-comparison-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: InitialOrInitialComparisonReportComponent,
  },
  {
    path: 'classification-count-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ClassificationCountReportComponent,
  },
  {
    path: 'reminders-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: RemindersReportComponent,
  },
  {
    path: 'sendback-comments-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: SendBackCommentsReportComponent,
  },
  {
    path: 'classification-change-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ClassificationChangeReportComponent,
  },
  {
    path: 'delay-report',
    // canActivate: [AuthGuard],
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
    // canActivate: [AuthGuard],
    component: UserListReportComponent,
  },
  {
    path: 'pending-observations',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: PendingObservationsDCEOComponent,
  },
  {
    path: 'pending-observations-report',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    component: PendingObservationsReportComponent,
  },
  {
    path: 'observations-per-department-report',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ObservationsPerDepartmentReportComponent,
  },
  {
    path: 'new-or-repeated-report/observation-detail/:obsId',
    // canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    component: ObservationDetailsReportComponent,
  },
];
