import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatSelectModule
} from '@angular/material/select';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatDividerModule
} from '@angular/material/divider';
import {
  MatTableModule
} from '@angular/material/table';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  TranslateModule
} from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { SharedVariableService } from '../../services/shared-variable.service';

export interface YearOption { value: string; }
export interface CycleOption { value: string; }

export interface ObservationData {
  cycle: string;
  from: string;
  to: string;
  stepName: string;
  department: string;
  date: string;
  attachment: boolean;
  completionDate: string;
  adjustmentMadeOnBehalf: string;
  GAndPAAttachment: string;
}

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent {
  readonly isRtl = toSignal(this.sharedVariableService.isRtl$, {
    initialValue: false,
  });

  readonly titleControl = new FormControl('', { nonNullable: true });
  readonly years: YearOption[] = [
    { value: 'Select Year' },
    { value: '2019-2020' },
    { value: '2020-2021' }
  ];

  readonly yearControl = new FormControl(this.years[0].value, { nonNullable: true });

  readonly cycles: CycleOption[] = [
    { value: 'All' },
    { value: 'SA1' },
    { value: 'SA2' }
  ];

  readonly cycleControl = new FormControl(this.cycles[0].value, { nonNullable: true });

  observationData: ObservationData[] = [
    {
      cycle: 'SA1', from: 'S.Engineer', to: 'TL', stepName: 'N/A',
      department: 'N/A', date: '2021-06-20T06:12:31Z', attachment: true,
      completionDate: '2021-06-20T06:12:31Z', adjustmentMadeOnBehalf: 'N/A',
      GAndPAAttachment: 'N/A'
    },
    {
      cycle: 'SA1', from: 'TL', to: 'Manager', stepName: 'N/A',
      department: 'N/A', date: '2021-06-20T06:12:31Z', attachment: true,
      completionDate: '2021-06-20T06:12:31Z', adjustmentMadeOnBehalf: 'N/A',
      GAndPAAttachment: 'N/A'
    },
    {
      cycle: 'SA1', from: 'Manager', to: 'G&PA', stepName: 'N/A',
      department: 'N/A', date: '2021-06-20T06:12:31Z', attachment: true,
      completionDate: '2021-06-20T06:12:31Z', adjustmentMadeOnBehalf: 'ديوان المحاس بة',
      GAndPAAttachment: 'N/A'
    }
  ];

  dataSource = new MatTableDataSource<ObservationData>(this.observationData);

  displayedColumns = [
    'cycle', 'from', 'to', 'stepName',
    'department', 'date', 'attachment',
    'completionDate', 'adjustmentMadeOnBehalf',
    'GAndPAAttachment'
  ];
  displayedColumnsTablet = [
    'cycle', 'from', 'to', 'department', 'date', 'attachment'
  ];
  displayedColumnsMob = ['cycle'];

  constructor(private readonly sharedVariableService: SharedVariableService) {}

  ngOnInit(): void {
    // nothing else needed—the signal already handles updates
  }

  trackByValue<T extends { value: string }>(_: number, item: T) {
    return item.value;
  }
}
