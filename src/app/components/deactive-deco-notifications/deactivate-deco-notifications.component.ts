import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  DestroyRef,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';

export interface EscalationData {
  userName: string;
  loginId: string;
  userJobTitle: string;
  departmentName: string;
  departmentCode: number;
  directorateName: string;
  directorateCode: number;
  regMailDisabled: boolean;
  esclatnMailDisabled: boolean;
}

@Component({
  standalone: true,
  selector: 'app-deactivate-deco-notifications',
  templateUrl: './deactivate-deco-notifications.component.html',
  styleUrls: ['./deactivate-deco-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SharedModule],
})
export class DeactivateDECONotificationsComponent implements OnInit {
  /** Whether layout is RTL */
  readonly isRtl = toSignal(this.sharedVariableService.isRtl$, {
    initialValue: false,
  });

  /** Table data source */
  readonly dataSource = new MatTableDataSource<EscalationData>([]);

  /** Columns to display in table */
  displayedColumns: string[] = [
    'userName',
    'loginId',
    'departmetName', // Note: matches the template 'departmetName'
    'userJobTitle',
    'regMailDisabled',
    'esclatnMailDisabled',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  /** Simple loading flag if needed for local UI feedback */
  isLoading = false;

  constructor(
    private readonly coreService: CoreService,
    private readonly notification: NzNotificationService,
    private readonly sharedVariableService: SharedVariableService,
    private readonly loadingService: LoadingService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    // Fetch the data from the server
    this.getDeactiveDECONotifications();
  }

  /**
   * Fetch the DECO notifications data
   */
  getDeactiveDECONotifications(): void {
    const url = 'UserController/getAllDCEOS';
    this.isLoading = true;
    this.loadingService.setLoading(true, url);

    this.coreService
      .get<EscalationData[]>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        this.dataSource.data = response;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error fetching DECO notifications:', err);
      },
      });
  }

  /**
   * Update the notification status (Regular & Escalation)
   */
  updateNotification(data: EscalationData): void {
    const url =
      `UserController/updateUserMailSettings?loginId=${data.loginId}` +
      `&isRegMailDisabled=${data.regMailDisabled}` +
      `&isEscltnMailDisabled=${data.esclatnMailDisabled}`;

    this.loadingService.setLoading(true, url);

    this.coreService
      .get<void>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.loadingService.setLoading(false, url);
        this.notification.create(
          'success',
          'Success',
          'Email notification activation status updated successfully.'
        );

        // Refresh the list
        this.getDeactiveDECONotifications();
      },
      error: (err) => {
        this.loadingService.setLoading(false, url);
        this.notification.create(
          'error',
          'Error',
          'Failed to update email notification status.'
        );
        console.error('Error updating notification:', err);
      },
      });
  }

}
