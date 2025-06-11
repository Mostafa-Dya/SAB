import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  isRtl: any;
  selectedChoice: any;
  choices = [
    { name: 'ALL_COLUMNS', value: 'All Columns' },
    { name: 'SELECTED_COLUMNS', value: 'Selected Columns' }
  ];
  columnsName: any;
  isColumnChecked: boolean = true

  constructor(
    public dialogRef: MatDialogRef<ExportComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
    this.columnsName = responseData;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.selectedChoice = this.choices[0];
  }

  selectionChange() {
    this.isColumnChecked = true;
    this.columnsName.map((data: any) => {
      data.isChecked = true
    })
  }

  checkColumnChecked() {
    let val = 0;
    this.columnsName.map((data: any) => {
      if (data.isChecked) {
        ++val;
      }
    })
    if (val == 0) {
      this.isColumnChecked = false;
    } else {
      this.isColumnChecked = true;
    }
  }

  onExport() {
    let exportData = {
      exportColumn: this.columnsName
    }
    this.dialogRef.close({ event: 'Send', data: exportData });
  }
}