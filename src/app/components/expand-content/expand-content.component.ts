import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ObservationCard } from 'src/app/models/observationCard.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

@Component({
  selector: 'app-expand-content',
  templateUrl: './expand-content.component.html',
  styleUrls: ['./expand-content.component.css']
})
export class ExpandContentComponent implements OnInit {
  isRtl: any;
  
  constructor(
    private sharedVariableService: SharedVariableService,
    public dialogRef: MatDialogRef<ExpandContentComponent>,
    @Inject(MAT_DIALOG_DATA) public observation: ObservationCard
    ) { }

  ngOnInit(): void {    
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
  }
}