import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
}

export interface Cycles {
  value: string;
}

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
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  isRtl: any;
  obsTitle: string;

  years: Years[] = [
    { value: 'Select Year' },
    { value: '2019-2020' },
    { value: '2020-2021' }
  ];
  selectedYear: string;
  cycles: Cycles[] = [
    { value: 'All' },
    { value: 'SA1' },
    { value: 'SA2' }
  ];
  selectedCycle: string;  
  observationData: ObservationData[] = [
    {
      "cycle": "SA1",
      "from": "S.Engineer",
      "to": "TL",
      "stepName": "N/A",
      "department": "N/A",
      "date": "2021-06-20T06:12:31Z",
      "attachment": true,
      "completionDate": "2021-06-20T06:12:31Z",
      "adjustmentMadeOnBehalf": "N/A",
      "GAndPAAttachment": "N/A"
    }, {
      "cycle": "SA1",
      "from": "TL",
      "to": "Manager",
      "stepName": "N/A",
      "department": "N/A",
      "date": "2021-06-20T06:12:31Z",
      "attachment": true,
      "completionDate": "2021-06-20T06:12:31Z",
      "adjustmentMadeOnBehalf": "N/A",
      "GAndPAAttachment": "N/A"
    }, {
      "cycle": "SA1",
      "from": "Manager",
      "to": "G&PA",
      "stepName": "N/A",
      "department": "N/A",
      "date": "2021-06-20T06:12:31Z",
      "attachment": true,
      "completionDate": "2021-06-20T06:12:31Z",
      "adjustmentMadeOnBehalf": "ديوان المحاس بة",
      "GAndPAAttachment": "N/A"
    }
  ]
  dataSource: MatTableDataSource<ObservationData>;
  displayedColumns: string[] = ['cycle', 'from', 'to', 'stepName', 'department', 'date', 'attachment', 'completionDate', 'adjustmentMadeOnBehalf', 'GAndPAAttachment'];
  displayedColumnsTablet: string[] = ['cycle', 'from', 'to', 'department', 'date', 'attachment'];
  displayedColumnsMob: string[] = ['cycle'];

  constructor(
    private coreService: CoreService,
    private router: Router,
    private sharedVariableService: SharedVariableService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.selectedYear = this.years[0].value;
    // this.selectedCycle = this.cycles[0].value;
    this.dataSource = new MatTableDataSource(this.observationData);
  }

}
