import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { LOCALE_ID } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of, Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import { NzNotificationService } from 'ng-zorro-antd/notification';


import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EditDelegationDialogComponent } from './edit-delegation-dialog/edit-delegation-dialog.component';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { DelegationMessagesService } from '../../services/delegation-messages.service';

export interface Users {
  loginId: number | string;
  userName: string;
  directorateName: string;
  department: string;
  designation: string;
}

export interface DelegatedUsers {
  id: number;
  fromLoginId: string;
  toLoginId: string;
  fromUserName: string;
  toUserName: string;
  delegationFrom: string; // 'DD/MM/YYYY'
  delegationTo: string;   // 'DD/MM/YYYY'
  delegateFrom: string;
  active: boolean;
  deleted: boolean;
  delegationReason: string;
  createDate: string;
  addedByUserName: string;
}

@Component({
  standalone: true,
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  providers: [
    // Remove any MomentDateAdapter references and custom date providers if not needed
    { provide: LOCALE_ID, useValue: 'en-GB' } 
    // (Optional) 'en-GB' ensures day-month-year ordering, but you can change or remove it
  ]
})
export class DelegationComponent implements OnInit, OnDestroy {
  /** Whether layout is RTL or LTR */
  isRtl = toSignal(this.sharedVariableService.isRtl$, { initialValue: false });

  /** Main forms for “self” delegation & “others” delegation */
  addDelegateUserForm!: FormGroup<{
    delegateUser: FormControl<Users | null>;
    from: FormControl<Date | null>;
    to: FormControl<Date | null>;
    reason: FormControl<string | null>;
  }>;
  addToDelegateForm!: FormGroup<{
    userData: FormControl<Users | null>;
    delegateUserData: FormControl<Users | null>;
    from: FormControl<Date | null>;
    to: FormControl<Date | null>;
    reason: FormControl<string | null>;
  }>;

  /** Convenience accessor for the delegateUserData control */
  get delegateUserDataControl(): FormControl<Users | null> {
    return this.addToDelegateForm.get('delegateUserData') as FormControl<Users | null>;
  }


  /** Holds the user info from localStorage */
  userInformation: any;
  loginId: string | undefined;
  userName: string | undefined;
  userJobTitle: string | undefined;
  isAdmin = false;

  /** For spinners/UX loading states */
  isLoading = false;

  /** For date fields */
  minDate = new Date();
  minToDate = new Date();
  minForToDate = new Date();
  isToDisable = true;

  /** Table data sources */
  dataSource!: MatTableDataSource<DelegatedUsers>;
  displayedColumns: string[] = [
    'delegateFrom',
    'user',
    'from',
    'to',
    'reason',
    'addedBy',
    'action'
  ];
  displayedColumnsMob: string[] = ['delegateFrom'];

  /** Observables for user lookups */
  filteredUser!: Observable<Users[]>;
  filteredUserData!: Observable<Users[]>;
  filteredDelegateData!: Observable<Users[]>;

  /** Additional state / flags */
  innerWidth = 0; // track window size
  msg = '';
  isButtonDisabled = true;
  isDisable = true;
  selectedTab: 'self' | 'others' = 'self';

  /** Form controls for “others” delegation */
  userData = new FormControl<Users | null>(null); // from
  delegateUserData = new FormControl<Users | null>(null); // to

  /** Local references for user input elements */
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  @ViewChild('delegateInput') delegateInput!: ElementRef<HTMLInputElement>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** A subject for unsubscribing from streams on destroy */
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private notification: NzNotificationService,
    private msgService: DelegationMessagesService
  ) {}

  ngOnInit(): void {


    // Load userInformation from localStorage
    const data: string | null = localStorage.getItem('sabUserInformation');
    if (data) {
      this.userInformation = JSON.parse(data);
      this.loginId = this.userInformation.sabMember.loginId;
      this.userName = this.userInformation.sabMember.userName;
      this.userJobTitle = this.userInformation.sabMember.userJobTitle;
      this.isAdmin = !!this.userInformation.admin;
    }

    // Prepare date constraints
    this.minToDate.setDate(this.minToDate.getDate() + 1);
    this.minForToDate.setDate(this.minForToDate.getDate() + 1);

    // Build the forms
    this.buildForms();

    // Check localStorage for an active tab
    const activeTab = localStorage.getItem('delegationTab');
    if (activeTab === 'others') {
      this.selectedTab = 'others';
    } else {
      this.selectedTab = 'self';
    }

    // If not admin, fetch “delegate to” data for self
    if (!this.isAdmin) {
      this.getDelegateToData(false);
    }

    // Load initial data depending on tab+role
    if (!this.isAdmin) {
      this.getSelfDelegatedUser();
    } else {
      if (this.selectedTab === 'self') {
        this.getSelfDelegatedUser();
      } else {
        this.getOthersDelegatedUser();
      }
    }

    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** HostListener for window resize, no event argument needed in the template. */
  @HostListener('window:resize')
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  /**
   * Construct reactive forms for “self” delegation & “others” delegation.
   */
  private buildForms(): void {
    // Self Delegation Form
    this.addDelegateUserForm = this.fb.group({
      delegateUser: this.fb.control<Users | null>(null, Validators.required),
      from: this.fb.control<Date | null>(null, Validators.required),
      to: this.fb.control<Date | null>(null, Validators.required),
      reason: this.fb.control<string | null>(null),
    });

    // Delegation to Others
    this.addToDelegateForm = this.fb.group({
      userData: this.fb.control<Users | null>(null, Validators.required),
      delegateUserData: this.fb.control<Users | null>({ value: null, disabled: this.isDisable }, Validators.required),
      from: this.fb.control<Date | null>(null, Validators.required),
      to: this.fb.control<Date | null>(null, Validators.required),
      reason: this.fb.control<string | null>(null),
    });
  }

  /**
   * Helper to format a date as DD/MM/YYYY using Angular’s formatDate.
   */
  private formatDateDDMMYYYY(date: Date | null): string {
    if (!date) return '';
    return formatDate(date, 'dd/MM/yyyy', this.locale);
  }

  /**
   * For “self” tab changes, fetch the list of delegations for the current user or user’s supervisor if SEC.
   */
  getSelfDelegatedUser(): void {
    let url = 'UserController/';
    if (this.userJobTitle === 'SEC') {
      url += 'getDelegationListByUser?currentUserId=' + this.userInformation.supervisorDetails.loginId;
    } else {
      url += 'getDelegationListByUser?currentUserId=' + this.loginId;
    }

    this.isLoading = true;
    this.loadingService.setLoading(true, url);
    this.coreService.get<DelegatedUsers[]>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error fetch SelfDelegatedUser:', err);
      }
    });
  }

  /**
   * For “others” tab changes, fetch the list of delegations assigned by current user or all if admin.
   */
  getOthersDelegatedUser(): void {
    let url = 'UserController/';

    if (this.isAdmin) {
      url += 'getDelegationListByGNPA';
    } else {
      // If not admin, from user or user’s supervisor if SEC
      if (this.userJobTitle === 'SEC') {
        url += 'getDelegationListByAddedByUser?currentUserId=' + this.userInformation.supervisorDetails.loginId;
      } else {
        url += 'getDelegationListByAddedByUser?currentUserId=' + this.loginId;
      }
    }

    this.isLoading = true;
    this.loadingService.setLoading(true, url);
    this.coreService.get<DelegatedUsers[]>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error fetch OthersDelegatedUser:', err);
      }
    });
  }

  /**
   * Tab group change event
   */
  onTabChange(tab: any): void {
    if (tab.index === 0) {
      this.selectedTab = 'self';
      localStorage.setItem('delegationTab', 'self');
      // If not admin, show “self” delegation data
      this.getDelegateToData(false);
      this.getSelfDelegatedUser();
    } else {
      this.selectedTab = 'others';
      localStorage.setItem('delegationTab', 'others');
      // If admin or normal user, show “others” delegation data
      this.getDelegateToData(true);
      this.getOthersDelegatedUser();
    }
  }

  /**
   * Called whenever the “From” date changes. Controls min date & validation logic for “To” date.
   */
  changeFrom(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.minToDate = event.value;
      this.isToDisable = false;
    } else {
      this.isToDisable = true;
    }

    // Compare from & to for the self-delegation form
    const formVal = this.addDelegateUserForm.value;
    if (formVal.from && formVal.to) {
      const fromMs = new Date(formVal.from).getTime();
      const toMs = new Date(formVal.to).getTime();
      this.isButtonDisabled = toMs < fromMs;
      this.msg = this.isButtonDisabled ? ' should be greater than or equal to ' : '';
    }

    // Compare from & to for the others-delegation form
    const formVal2 = this.addToDelegateForm.value;
    if (formVal2.from && formVal2.to) {
      const fromMs = new Date(formVal2.from).getTime();
      const toMs = new Date(formVal2.to).getTime();
      this.isButtonDisabled = toMs < fromMs;
      this.msg = this.isButtonDisabled ? ' should be greater than or equal to ' : '';
    }
  }

  /**
   * Called whenever the “To” date changes. Re-check date logic.
   */
  changeTo(): void {
    const formVal = this.addDelegateUserForm.value;
    if (formVal.from && formVal.to) {
      const fromMs = new Date(formVal.from).getTime();
      const toMs = new Date(formVal.to).getTime();
      this.isButtonDisabled = toMs < fromMs;
      this.msg = this.isButtonDisabled && toMs !== 0 ? ' should be greater than or equal to ' : '';
    } else if (formVal.to == null) {
      this.msg = '';
    }

    const formVal2 = this.addToDelegateForm.value;
    if (formVal2.from && formVal2.to) {
      const fromMs = new Date(formVal2.from).getTime();
      const toMs = new Date(formVal2.to).getTime();
      this.isButtonDisabled = toMs < fromMs;
      this.msg = this.isButtonDisabled && toMs !== 0 ? ' should be greater than or equal to ' : '';
    } else if (formVal2.to == null) {
      this.msg = '';
    }
  }

  /** Utility to show reactive form errors in the template. */
  public errorHandling = (control: string, error: string) => {
    return this.addDelegateUserForm.controls[control]?.hasError(error);
  };

  /**
   * “Self” Delegation: Add new delegation from the current user to another.
   */
  addDelegateUser(): void {
    if (this.addDelegateUserForm.invalid) {
      return;
    }
    const { delegateUser, from, to, reason } = this.addDelegateUserForm.value;

    const delegateData = {
      fromLoginId: this.userJobTitle === 'SEC'
        ? this.userInformation.supervisorDetails.loginId
        : this.loginId,
      addedUserName: this.userJobTitle === 'SEC'
        ? `${this.userName} on behalf of ${this.userInformation.supervisorDetails.userName}`
        : this.userName,
      addedLoginId: this.userJobTitle === 'SEC'
        ? this.userInformation.supervisorDetails.loginId
        : this.loginId,
      toLoginId: delegateUser.loginId,
      delegateFrom: this.formatDateDDMMYYYY(from),
      delegateTo: this.formatDateDDMMYYYY(to),
      fromUserName: this.userJobTitle === 'SEC'
        ? this.userInformation.supervisorDetails.userName
        : this.userName,
      toUserName: delegateUser.userName,
      delegateReason: reason || '',
      toJobTitle: delegateUser.designation,
      fromJobTitle: this.userJobTitle === 'SEC'
        ? this.userInformation.supervisorDetails.userJobTitle
        : this.userJobTitle
    };

    const url = 'UserController/addDelegation';
    this.isLoading = true;
    this.loadingService.setLoading(true, url);

    this.coreService.post(url, delegateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        this.addDelegateUserForm.reset();

        this.notification.create(
          'success',
          'Success',
          this.msgService.addSuccess
        );
        this.getSelfDelegatedUser();
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error addDelegateUser:', err);
      }
    });
  }

  /**
   * “Others” Delegation: Add new delegation from one user (userData) to another (delegateUserData).
   */
  addDelegateToOthers(): void {
    if (this.addToDelegateForm.invalid) {
      return;
    }
    const { userData, delegateUserData, from, to, reason } = this.addToDelegateForm.value;

    const delegateData = {
      fromLoginId: userData.loginId,
      addedUserName: this.userJobTitle === 'SEC'
        ? `${this.userName} on behalf of ${this.userInformation.supervisorDetails.userName}`
        : this.userName,
      addedLoginId: this.userJobTitle === 'SEC'
        ? this.userInformation.supervisorDetails.loginId
        : this.loginId,
      toLoginId: delegateUserData.loginId,
      delegateFrom: this.formatDateDDMMYYYY(from),
      delegateTo: this.formatDateDDMMYYYY(to),
      fromUserName: userData.userName,
      toUserName: delegateUserData.userName,
      delegateReason: reason || '',
      toJobTitle: delegateUserData.designation,
      fromJobTitle: userData.designation
    };

    const url = 'UserController/addDelegation';
    this.isLoading = true;
    this.loadingService.setLoading(true, url);

    this.coreService.post(url, delegateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        this.addToDelegateForm.reset();

        this.notification.create(
          'success',
          'Success',
          this.msgService.addSuccess
        );

        // Clear the "to" data & disable it
        this.filteredDelegateData = of([]);
        this.delegateUserDataControl.disable();
        this.isDisable = true;
        this.getOthersDelegatedUser();
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error addDelegateToOthers:', err);
      }
    });
  }

  /**
   * Get the “delegate to” user list. If `isForOthers` is true, we fetch for the admin scenario; otherwise for self.
   */
  getDelegateToData(isForOthers: boolean): void {
    this.isLoading = true;
    let url = 'UserController/';
    if (this.userJobTitle === 'SEC') {
      url += `getDelegationUsersList?currentUserId=${this.userInformation.supervisorDetails.loginId}&isForOthers=${isForOthers}`;
    } else {
      url += `getDelegationUsersList?currentUserId=${this.loginId}&isForOthers=${isForOthers}`;
    }

    this.loadingService.setLoading(true, url);
    this.coreService.get<Users[]>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        // This is the “users” array used by the self-delegation form
        // or for the “userData” in the others form
        const allUsers = response;
        // For “self” form:
        this.filteredUser = this.addDelegateUserForm
          .get('delegateUser')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value?.name)),
            map((name) => {
              if (!name) return allUsers.slice();
              const filterValue = name.toLowerCase();
              return allUsers.filter(
                (option) =>
                  option.userName.toLowerCase().includes(filterValue) ||
                  option.loginId.toString().toLowerCase().includes(filterValue)
              );
            })
          );

        // For “others” form userData
        this.filteredUserData = this.addToDelegateForm
          .get('userData')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value?.name)),
            map((name) => {
              if (!name) return this.isAdmin ? [] : allUsers.slice();
              const filterValue = name.toLowerCase();
              return allUsers.filter(
                (option) =>
                  option.userName.toLowerCase().includes(filterValue) ||
                  option.loginId.toString().toLowerCase().includes(filterValue)
              );
            })
          );
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);
        console.error('Error getDelegateToData:', err);
      }
    });
  }

  /**
   * Fired whenever admin picks the "From" user. We enable the “to” user, then load the possible "to" user list.
   */
  selectedUser(): void {
    this.addToDelegateForm.get('delegateUserData')?.enable();
    this.isDisable = false;

    const selected = this.addToDelegateForm.value.userData;
    if (!selected || !selected.loginId) {
      return;
    }

    const url = `UserController/getDelegationUsersList?currentUserId=${selected.loginId}`;
    this.coreService.get<Users[]>(url).subscribe({
      next: (response) => {
        // This is the "to" user array
        const allDelegateUsers = response;

        // Filter pipeline for “delegateUserData”
        this.filteredDelegateData = this.addToDelegateForm
          .get('delegateUserData')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value?.name)),
            map((name) => {
              if (!name) return allDelegateUsers.slice();
              const filterValue = name.toLowerCase();
              return allDelegateUsers.filter(
                (option) =>
                  option.userName.toLowerCase().includes(filterValue) ||
                  option.loginId.toString().toLowerCase().includes(filterValue)
              );
            })
          );
      },
      error: (err) => {
        console.error('Error selectedUser => getDelegationUsersList:', err);
      }
    });
  }

  /**
   * Checks whether the user typed in “From” user has changed or cleared the field.
   * If cleared, disable the “to” user selection & reset.
   */
  checkFromUser(element: HTMLInputElement): void {
    const typedVal = element.value;
    const formVal = this.addToDelegateForm.get('userData')?.value;
    if (!typedVal || !formVal || typeof formVal !== 'object') {
      // Clear “to” user
      this.filteredDelegateData = of([]);
      this.delegateUserDataControl.disable();
      this.isDisable = true;
      this.addToDelegateForm.get('delegateUserData')?.reset();
    }
  }

  /**
   * Delete an existing delegation after user confirmation.
   */
  deleteDelegation(delegation: DelegatedUsers): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogHeader: 'DELETE',
        dialogMessage: 'ARE_YOU_SURE_DELETE_DELEGATION'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Send') {
        this._onDeleteDelegation(delegation.id);
      }
    });
  }

  /**
   * Internal method to call the server and remove a delegation by ID.
   */
  private _onDeleteDelegation(delegationId: number): void {
    this.isLoading = true;
    const url = `UserController/deleteDelegate?delegateId=${delegationId}`;
    this.loadingService.setLoading(true, url);

    this.coreService.delete(url, {}).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        if (!this.isAdmin && this.selectedTab === 'self') {
          this.getSelfDelegatedUser();
        } else {
          this.getOthersDelegatedUser();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingService.setLoading(false, url);

        // Even on error, re-fetch
        if (!this.isAdmin && this.selectedTab === 'self') {
          this.getSelfDelegatedUser();
        } else {
          this.getOthersDelegatedUser();
        }
      }
    });
  }

  /**
   * Edit an existing delegation. Opens a dialog, then refreshes data upon close.
   */
  editDelegation(delegation: DelegatedUsers): void {
    const dialogRef = this.dialog.open(EditDelegationDialogComponent, {
      width: '800px',
      data: JSON.stringify(delegation)
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event?.message === 'Delegation updated successfully') {
        // Refresh depending on tab & role
        if (!this.isAdmin && this.selectedTab === 'self') {
          this.getSelfDelegatedUser();
        } else if (!this.isAdmin && this.selectedTab === 'others') {
          this.getOthersDelegatedUser();
        } else if (this.isAdmin && this.selectedTab === 'self') {
          this.getOthersDelegatedUser();
        }
      }
    });
  }
}
