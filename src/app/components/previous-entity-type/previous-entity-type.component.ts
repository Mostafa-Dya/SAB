import { Component, OnInit, Inject, NgModule  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from '../../services/shared-variable.service';

@Component({
  selector: 'app-previous-entity-type',
  templateUrl: './previous-entity-type.component.html',
  styleUrls: ['./previous-entity-type.component.css']
})
export class PreviousEntityTypeComponent implements OnInit {
  
  isRtl:any;
  selectedResponse: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) { }

  ngOnInit(): void {
   this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    console.log(this.data)
    
  }
  
}
