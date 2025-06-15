import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full'
    // loadChildren: () => import('./components/inbox/inbox.module').then(m => m.InboxModule)
  }, {
    path: 'inbox',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/inbox/inbox.module').then(m => m.InboxModule)
  }, {
    path: 'sent-items',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/sent-items/sent-items.module').then(m => m.SentItemsModule)
  }, {
    path: 'archive',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/archive/archive.module').then(m => m.ArchiveModule)
  }, {
    path: 'launchReports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/launch-reports/launch-reports.module').then(m => m.LaunchReportsModule)
  }, {
    path: 'extractReports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/extract-observation/extract-observation.module').then(m => m.ExtractObservationModule)
  }, {
    path: 'response-progress',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/response-progress/response-progress.module').then(m => m.ResponseProgressModule)
  }, {
    path: 'settings',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule)
  }, {
    path: 'observation-settings',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/observation-settings/observation-settings.module').then(m => m.ObservationSettingsModule)
  }, {
    path: 'search-observations',
    loadChildren: () => import('./components/search-observations/search-observations.module').then(m => m.SearchObservationsModule)
  }, {
    path: 'running-observations',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/search-running-observations/search-running-observations.module').then(m => m.SearchRunningObservationsModule)
  }, {
    path: 'archived-observations',
    canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    loadChildren: () => import('./components/archived-observations/archived-observations.module').then(m => m.ArchivedObservationsModule)
  },
  {
    path: 'search-reports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/search-reports/search-reports.module').then(m => m.SearchReportsModule)
  }, {
    path: 'upload-reports',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/upload-reports/upload-reports.module').then(m => m.UploadReportsModule)
  }, {
    path: 'delegation',
    canActivate: [AuthGuard],
    data: {
      role: 'SEC'
    },
    loadChildren: () => import('./components/delegation/delegation.module').then(m => m.DelegationModule)
  }, {
    path: 'reports',
    canActivate: [AuthGuard],
    // data: {
    //   role: 'admin'
    // },
    loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule)
  }, {
    path: 'escalation-settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/escalation-settings/escalation-settings.module').then(m => m.EscalationSettingsModule)
  },{
    path: 'contact-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/g&pa-contact-details/g&pa-contact-details.module').then(m => m.GPAContactDetailsModule)
  },{
    path: 'deactive-deco-notification',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/deactive-deco-notifications/deactivate-deco-notifications.module').then(m => m.DeactivateDECONotificationsModule)
    
  }  , 
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule)
  },
  // {path: '401', loadChildren: () => import('./components/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)},
  // {path: '**', redirectTo: '/401'}
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,{
      preloadingStrategy: PreloadAllModules, 
      useHash: true 
    }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
