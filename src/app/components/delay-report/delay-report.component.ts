import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '../../services/config.service';
import { CoreService } from '../../services/core.service';
import { LoadingService } from '../../services/loading.service';
import { SharedVariableService } from '../../services/shared-variable.service';
import { SharedModule } from '../../shared/modules/shared.module';

export class Group {
  level = 0;
  parent?: Group;
  expanded = false;
  totalCounts = 0;
  totalCount = 0;

  [key: string]: any;

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
}

export interface DirectorateDTO {
  id: string;
  name: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
}

/** The shape of each row in the final table. */
export interface ReportDataTable {
  department: string;
  manager: number;
  teamLeader: number;
  user: number;
  total: number;
  organization: string;
  totalCount: number;
}

/** Response from the server's "searchDelayReport" or "getDirectorateData" endpoints, etc. */
interface DelayReportResponse {
  code: string;
  name: string;
  count: number;
  departments: Array<{
    deptCode: number;
    deptName: string;
    pendingUser: number;
    pendingManager: number;
    pendingTl: number;
    count: number;
  }>;
}

@Component({
  standalone: true,
  selector: 'app-delay-report',
  templateUrl: './delay-report.component.html',
  styleUrls: ['./delay-report.component.scss'],
  imports: [SharedModule],
})
export class DelayReportComponent implements OnInit, OnDestroy {
  /** Data after fetching from server. Used for grouping logic. */
  private allData: ReportDataTable[] = [];

  /** Table data source containing raw rows + group rows. */
  public dataSource = new MatTableDataSource<any>([]);

  /** Displayed columns for wide screens. */
  displayedColumns: string[] = [
    'department',
    'manager',
    'teamLeader',
    'user',
    'total',
  ];

  /** Displayed columns for smaller screens. */
  displayedColumnsSmallMob: string[] = ['department', 'total'];

  /** The columns used for grouping rows. */
  groupByColumns: (keyof ReportDataTable)[] = ['organization'];
  /** All year options. */
  years: Years[] = [];

  /** All report-type options. */
  reportType: ReportType[] = [
    { value: 'KNPC Response Report', name: 'KNPC_RESPONSE_REPORT' },
    { value: 'SAB Quarterly Report Q1', name: 'SAB_QUARTERLY_REPORT_Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'SAB_QUARTERLY_REPORT_Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'SAB_QUARTERLY_REPORT_Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'SAB_QUARTERLY_REPORT_Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'SAB_SEMI_ANNUAL_REPORT_1' },
    { value: 'SAB Semi-annual Report 2', name: 'SAB_SEMI_ANNUAL_REPORT_2' },
  ];

  /** Form controls for directorate & department multi-selection. */
  directorateData = new FormControl<string[] | null>(null);
  departmentData = new FormControl<string[] | null>(null);

  /** List of all directorates in string form (for the multi-select). */
  directorateList: string[] = ['All'];
  /** Backing store with IDs for each directorate. */
  directorateAllValues: DirectorateDTO[] = [{ id: 'All', name: 'All' }];

  /** List of all departments in string form (for the multi-select). */
  departmentList: string[] = ['All'];
  /** Backing store with IDs for each department. */
  departmentAllValues: DepartmentDTO[] = [{ id: 'All', name: 'All' }];

  /** Tracks whether user has selected 'All' for directorates & we are adjusting. */
  private isDirectorateFirst = false;
  /** Tracks whether user has selected 'All' for departments & we are adjusting. */
  private isDepartmentFirst = false;

  /** The currently selected year. */
  selectedYear = '';
  /** The currently selected report type. */
  selectedReport = 'KNPC Response Report';

  /** The logged-in user info from localStorage. */
  userInformation: any;
  /** The jobTitle for the current user. */
  userJobTitle: any;
  /** Whether the user is an admin. */
  isAdmin: boolean | undefined;

  /** Main base URL from config. */
  mainUrl = '';

  /** If user is delegated or not. (You had logic referencing “onBehalfOf” etc.) */
  selectedDelegateUserInfo: any;

  /** For toggling the spinner or manual isLoading. */
  isLoading = true;

  /** Whether layout is RTL or LTR. */
  isRtl = false;

  /** A simple array referencing the raw data (converted to table rows). */
  data: ReportDataTable[] = [];

  /** Screen width for responsive logic. */
  innerWidth = 0;

  /** Subject to clean up subscriptions. */
  private readonly destroy$ = new Subject<void>();

  isGroup = (index: number, rowData: any) => {
  // If you used a `Group` class, check with `instanceof Group`:
  return rowData instanceof Group;
};

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private configService: ConfigService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Subscribe to RTL changes
    this.sharedVariableService.isRtl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rtl) => (this.isRtl = rtl));

    // Load sabUserInformation from localStorage
    const sabUserInformation = localStorage.getItem('sabUserInformation');
    if (sabUserInformation) {
      this.userInformation = JSON.parse(sabUserInformation);
      this.userJobTitle = this.userInformation?.sabMember?.userJobTitle;
      this.isAdmin = this.userInformation?.admin;
      this.selectedYear = this.userInformation?.reportYear || '';
    }

    this.innerWidth = window.innerWidth;

    // Base URL from config
    this.mainUrl = this.configService['baseUrl'];

    // Initialize directorate & department data
    this.getDirectorateData();
    this.getYear();
  }

  ngOnDestroy(): void {
    // clean up any ongoing Observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Listen for window resize events to handle small-screen vs. large-screen logic */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  /**
   * Retrieve the year list from the server.
   */
  getYear(): void {
    const url = 'uploadReportController/getReportYears';
    this.loadingService.setLoading(true, url);

    this.coreService
      .get<string[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingService.setLoading(false, url);

          // Example logic to push them into `this.years`
          const result: Years[] = response.map((year) => ({ value: year }));
          // reverse if you want the newest first
          result.reverse();

          // Append them to our existing array
          this.years = [...this.years, ...result];
          // set default selection to the first
          if (this.years[0]) {
            this.selectedYear = this.years[0].value;
          }
        },
        error: (err) => {
          this.loadingService.setLoading(false, url);
          console.error('getYear() error:', err);
        },
      });
  }

  /**
   * Fetch directorate data from server to populate the multi-select.
   */
  getDirectorateData(): void {
    const url = 'UserController/getsabDirectorates';
    this.loadingService.setLoading(true, url);

    this.directorateAllValues = [{ id: 'All', name: 'All' }];
    this.directorateList = ['All'];

    this.coreService
      .get<Record<string, string>>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingService.setLoading(false, url);

          // Convert object { "101210":"Deputy C.E.O. ...", ...} to array
          Object.keys(response).forEach((key) => {
            this.directorateAllValues.push({ id: key, name: response[key] });
            this.directorateList.push(response[key]);
          });

          // Sort them
          this.directorateAllValues.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
          this.directorateList.sort();

          // Optionally read from localStorage
          const filterDirectorate = localStorage.getItem(
            'sabDelayStatFilterDirectorate'
          );
          if (filterDirectorate != null) {
            // e.g. parse & set, if desired
            // this.directorateData.setValue(JSON.parse(filterDirectorate))
          } else {
            localStorage.setItem(
              'sabDelayStatFilterDirectorate',
              JSON.stringify([])
            );
          }

          this.getDepartmentData();
        },
        error: (err) => {
          this.loadingService.setLoading(false, url);
          console.error('getDirectorateData() error:', err);
        },
      });
  }

  /**
   * Fetch department data from server to populate the multi-select.
   */
  getDepartmentData(): void {
    let url = 'UserController/getsabDepartments';
    if (!this.isAdmin) {
      url +=
        '?directorateId=' + this.userInformation?.sabMember?.directorateCode;
    }

    this.loadingService.setLoading(true, url);
    this.departmentAllValues = [{ id: 'All', name: 'All' }];
    this.departmentList = ['All'];

    this.coreService
      .get<Record<string, string>>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingService.setLoading(false, url);

          Object.keys(response).forEach((key) => {
            this.departmentAllValues.push({ id: key, name: response[key] });
            this.departmentList.push(response[key]);
          });

          this.departmentAllValues.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
          this.departmentList.sort();

          // Optionally read from localStorage
          const filterDepartment = localStorage.getItem(
            'sabDelayStatFilterDepartment'
          );
          if (filterDepartment != null) {
            // e.g. parse & set, if desired
            // this.departmentData.setValue(JSON.parse(filterDepartment))
          } else {
            localStorage.setItem(
              'sabDelayStatFilterDepartment',
              JSON.stringify([])
            );
          }
        },
        error: (err) => {
          this.loadingService.setLoading(false, url);
          console.error('getDepartmentData() error:', err);
        },
      });
  }

  /**
   * Called whenever user changes department multi-select. Handles the "All" logic.
   */
  departmentChange(event: any): void {
    if (this.isDepartmentFirst) {
      return;
    }
    const isAll = event.source.value === 'All';
    this.isDepartmentFirst = true;

    const filterDeptStr = localStorage.getItem('sabDelayStatFilterDepartment');
    let filterDept = filterDeptStr ? JSON.parse(filterDeptStr) : [];

    if (isAll) {
      if (event.source._selected) {
        // user selected 'All'
        this.departmentData.setValue(this.departmentList);
        localStorage.setItem(
          'sabDelayStatFilterDepartment',
          JSON.stringify([])
        );
      } else {
        // user unselected 'All'
        this.departmentData.setValue([]);
        localStorage.setItem(
          'sabDelayStatFilterDepartment',
          JSON.stringify(this.departmentList)
        );
      }
    } else {
      // A specific department
      if (!event.source._selected) {
        // user unselected
        setTimeout(() => {
          if (this.departmentData.value?.[0] === 'All') {
            const newVal = [...(this.departmentData.value as string[])];
            newVal.splice(0, 1);
            this.departmentData.setValue(newVal);
          }
          filterDept = [...filterDept, event.source.value];
          localStorage.setItem(
            'sabDelayStatFilterDepartment',
            JSON.stringify(filterDept)
          );
          this.isDepartmentFirst = false;
        }, 300);
      } else {
        // user selected a specific department
        setTimeout(() => {
          const idx = filterDept.indexOf(event.source.value);
          if (idx >= 0) {
            filterDept.splice(idx, 1);
            localStorage.setItem(
              'sabDelayStatFilterDepartment',
              JSON.stringify(filterDept)
            );
          }
          // if selected + 1 == departmentList.length => user effectively selected all
          if (
            this.departmentData.value &&
            this.departmentData.value.length + 1 === this.departmentList.length
          ) {
            this.departmentData.setValue(this.departmentList);
            localStorage.setItem(
              'sabDelayStatFilterDepartment',
              JSON.stringify([])
            );
          }
          this.isDepartmentFirst = false;
        }, 300);
      }
    }
    this.isDepartmentFirst = false;
  }

  /**
   * Called whenever user changes directorate multi-select. Handles the "All" logic.
   */
  directorateChange(event: any): void {
    if (this.isDirectorateFirst) {
      return;
    }
    const isAll = event.source.value === 'All';
    this.isDirectorateFirst = true;

    const filterDirStr = localStorage.getItem('sabDelayStatFilterDirectorate');
    let filterDir = filterDirStr ? JSON.parse(filterDirStr) : [];

    if (isAll) {
      if (event.source._selected) {
        // user selected 'All'
        this.directorateData.setValue(this.directorateList);
        localStorage.setItem(
          'sabDelayStatFilterDirectorate',
          JSON.stringify([])
        );
      } else {
        // user unselected 'All'
        this.directorateData.setValue([]);
        localStorage.setItem(
          'sabDelayStatFilterDirectorate',
          JSON.stringify(this.directorateList)
        );
      }
    } else {
      // A specific directorate
      if (!event.source._selected) {
        // user unselected
        setTimeout(() => {
          if (this.directorateData.value?.[0] === 'All') {
            const newVal = [...(this.directorateData.value as string[])];
            newVal.splice(0, 1);
            this.directorateData.setValue(newVal);
          }
          filterDir = [...filterDir, event.source.value];
          localStorage.setItem(
            'sabDelayStatFilterDirectorate',
            JSON.stringify(filterDir)
          );
          this.isDirectorateFirst = false;
        }, 300);
      } else {
        // user selected a specific directorate
        setTimeout(() => {
          const idx = filterDir.indexOf(event.source.value);
          if (idx >= 0) {
            filterDir.splice(idx, 1);
            localStorage.setItem(
              'sabDelayStatFilterDirectorate',
              JSON.stringify(filterDir)
            );
          }
          // if selected + 1 == directorateList.length => user effectively selected all
          if (
            this.directorateData.value &&
            this.directorateData.value.length + 1 ===
              this.directorateList.length
          ) {
            this.directorateData.setValue(this.directorateList);
            localStorage.setItem(
              'sabDelayStatFilterDirectorate',
              JSON.stringify([])
            );
          }
          this.isDirectorateFirst = false;
        }, 300);
      }
    }
    this.isDirectorateFirst = false;
  }

  /**
   * Fetch the "delay report" data from the server and update the table.
   */
  getDelayReport(): void {
    let departmentData = this.buildMultiSelectionParam(
      this.departmentData.value,
      this.departmentAllValues
    );
    let directorateData = this.buildMultiSelectionParam(
      this.directorateData.value,
      this.directorateAllValues
    );

    // if user selected 'All'
    if (
      this.departmentData.value &&
      this.departmentData.value.length === this.departmentAllValues.length
    ) {
      departmentData = 'All';
    }
    if (
      this.directorateData.value &&
      this.directorateData.value.length === this.directorateAllValues.length
    ) {
      directorateData = 'All';
    }

    let url =
      `SearchController/searchDelayReport?reportYear=${this.selectedYear}` +
      `&reportCycle=${this.selectedReport}` +
      `&dirId=${directorateData}` +
      `&depId=${departmentData}`;

    // handle delegated user or SEC user logic
    if (this.selectedDelegateUserInfo) {
      url += `&userJobTitle=${this.userJobTitle}&isDelegatedUser=true&onBehalfOf=${this.selectedDelegateUserInfo.loginId}`;
    } else {
      if (this.userJobTitle === 'SEC') {
        const supLogin = this.userInformation?.supervisorDetails?.loginId || '';
        url += `&userJobTitle=SEC&isDelegatedUser=false&onBehalfOf=${supLogin}`;
      } else {
        const sabLogin = this.userInformation?.sabMember?.loginId || '';
        url += `&userJobTitle=${this.userJobTitle}&isDelegatedUser=false&onBehalfOf=${sabLogin}`;
      }
    }

    this.data = [];
    this.loadingService.setLoading(true, url);

    this.coreService
      .get<DelayReportResponse[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingService.setLoading(false, url);
          // Flatten the nested data
          const flattened: ReportDataTable[] = [];
          for (const orgItem of response) {
            for (const deptItem of orgItem.departments) {
              flattened.push({
                department: deptItem.deptName,
                manager: deptItem.pendingManager,
                teamLeader: deptItem.pendingTl,
                user: deptItem.pendingUser,
                total: deptItem.count,
                organization: orgItem.name,
                totalCount: orgItem.count,
              });
            }
          }
          this.data = flattened;
          this.allData = flattened;

          // Group the data
          this.dataSource.data = this.addGroups(
            this.allData,
            this.groupByColumns
          );
          if (
            this.dataSource.data.length > 0 &&
            this.dataSource.data[0] instanceof Group
          ) {
            // expand the top group by default
            (this.dataSource.data[0] as Group).expanded = true;
          }

          // Set up custom filter
          this.dataSource.filterPredicate =
            this.customFilterPredicate.bind(this);
          // Trigger the filter to process grouping
          this.dataSource.filter = performance.now().toString();
        },
        error: (err) => {
          this.loadingService.setLoading(false, url);
          console.error('getDelayReport() error:', err);
        },
      });
  }

  /**
   * Helper to convert form-control arrays to comma-delimited IDs (based on a reference array).
   */
  private buildMultiSelectionParam(
    selectedValues: string[] | null,
    allValues: Array<{ id: string; name: string }>
  ): string {
    if (!selectedValues || !selectedValues.length) {
      return '';
    }
    const ids: string[] = [];
    for (const val of selectedValues) {
      // find the matching ID
      const found = allValues.find((x) => x.name === val);
      if (found) {
        ids.push(found.id);
      }
    }
    return ids.join(',');
  }

  /**
   * Row grouping logic
   */
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: ReportDataTable): boolean {
    // find any group row(s) that match this row’s grouping columns
    const groupRows = this.dataSource.data.filter((row: any) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns.forEach((column) => {
        if (row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    });

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row: Group): void {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();
  }

  addGroups(data: ReportDataTable[], groupByCols: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByCols, rootGroup);
  }

  getSublevel(
    data: ReportDataTable[],
    level: number,
    groupByCols: string[],
    parent: Group
  ): any[] {
    if (level >= groupByCols.length) {
      return data;
    }
    // Create top-level groups
    const groups = this.uniqueBy(
      data.map((row) => {
        const result = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByCols[i]] = row[groupByCols[i] as keyof ReportDataTable];
        }
        return result;
      }),
      JSON.stringify
    );

    const currentCol = groupByCols[level];
    let subGroups: any[] = [];

    groups.forEach((group) => {
      const rowsInGroup = data.filter(
        (row) => group[currentCol] === row[currentCol as keyof ReportDataTable]
      );
      group.totalCounts = rowsInGroup.length;

      // e.g. totalCount from the first row
      if (rowsInGroup.length > 0) {
        group.totalCount = rowsInGroup[0].totalCount;
      }

      const subGroup = this.getSublevel(
        rowsInGroup,
        level + 1,
        groupByCols,
        group
      );
      // Insert the group row at the start of subGroup
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(array: any[], keyFn: (item: any) => string): any[] {
    const seen: { [key: string]: boolean } = {};
    return array.filter((item) => {
      const k = keyFn(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  /** Export the table data to MS Word */
  msWord(): void {
    let departmentData = this.buildMultiSelectionParam(
      this.departmentData.value,
      this.departmentAllValues
    );
    let directorateData = this.buildMultiSelectionParam(
      this.directorateData.value,
      this.directorateAllValues
    );
    // handle 'All'
    if (
      this.departmentData.value &&
      this.departmentData.value.length === this.departmentAllValues.length
    ) {
      departmentData = 'All';
    }
    if (
      this.directorateData.value &&
      this.directorateData.value.length === this.directorateAllValues.length
    ) {
      directorateData = 'All';
    }

    const url =
      'ReminderAndClassificationExportController/exportDelayReportToWord' +
      `?reportYear=${this.selectedYear}` +
      `&reportCycle=${this.selectedReport}` +
      `&dirId=${directorateData}` +
      `&depId=${departmentData}`;

    window.open(this.mainUrl + url, '_parent');
  }

  /** Export the table data to MS Excel */
  msExcel(): void {
    let departmentData = this.buildMultiSelectionParam(
      this.departmentData.value,
      this.departmentAllValues
    );
    let directorateData = this.buildMultiSelectionParam(
      this.directorateData.value,
      this.directorateAllValues
    );
    // handle 'All'
    if (
      this.departmentData.value &&
      this.departmentData.value.length === this.departmentAllValues.length
    ) {
      departmentData = 'All';
    }
    if (
      this.directorateData.value &&
      this.directorateData.value.length === this.directorateAllValues.length
    ) {
      directorateData = 'All';
    }

    const url =
      'ReminderAndClassificationExportController/exportDelayReportToExcel' +
      `?reportYear=${this.selectedYear}` +
      `&reportCycle=${this.selectedReport}` +
      `&dirId=${directorateData}` +
      `&depId=${departmentData}`;

    window.open(this.mainUrl + url, '_parent');
  }
}
