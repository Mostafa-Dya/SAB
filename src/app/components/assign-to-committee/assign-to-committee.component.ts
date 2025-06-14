import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { map, startWith } from 'rxjs/operators';
declare var $: any;
interface Committee {
  departmentCode: number;
  departmentName: string;
  directorateCode: number;
  directorateName: string;
  divisionCode: number;
  loginId: string;
  userName: string;
  userJobTitle: string;
}

interface CommitteeGroup {
  jobTitle: string;
  committee: Committee[];
}

interface FormattedGroup {
  jobTitle: string;
  committee: Committee[];
}

@Component({
  selector: 'app-assign-to-committee',
  templateUrl: './assign-to-committee.component.html',
  styleUrls: ['./assign-to-committee.component.css']
})
export class AssignToCommitteeComponent implements OnInit {
  isRtl: any;
  committeeControl = new FormControl();
  formattedControl = new FormControl();
  committeeGroups: any[];
  formattedGroups: FormattedGroup[];
  groupComment: String = '';
  dialougeType: any;
  selectedHeads : any;
  selectedFormatted : any;
  filteredOptions: Observable<any[]>;
  formattedFilteredOptions:FormattedGroup[];
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    public dialogRef: MatDialogRef<AssignToCommitteeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
    this.dialougeType = data.dialougeType;

    this.committeeGroups = data.committeeusers;
    this.committeeGroups = [
      {
        jobTitle: 'CEO',
        committee: data.committeeusers.committeeHeadCEOs
      }, {
        jobTitle: 'DCEO',
        committee: data.committeeusers.committeeHeadDCEOs
      },
       {
        jobTitle: 'Manager',
        committee: data.committeeusers.committeeHeadManagers
      }, 
      {
        jobTitle: 'Team Leader',
        committee: data.committeeusers.committeeHeadTls
      }
    ];

    this.formattedGroups = [
      {
        jobTitle: 'CEO',
        committee: data.committeeusers.formatterCEOs
      }, {
        jobTitle: 'DCEO',
        committee: data.committeeusers.formatterDCEOs
      }
    ]
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });


    this.filteredOptions = this.committeeControl.valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filter(value) : this.committeeGroups),
    );


  }

  private _filter(value: string): any[] {
  
    const filterValue = value.toLowerCase();
    let isNew = true;
    let filter = [];
    for(let j = 0 ; j < this.committeeGroups.length ; j++){  
      for(let i = 0 ; i < this.committeeGroups[j].committee.length ; i++){     
        if(this.committeeGroups[j].committee[i].userName.toLowerCase().includes(filterValue) || this.committeeGroups[j].committee[i].loginId.toLowerCase().includes(filterValue) || this.committeeGroups[j].jobTitle.toLowerCase().includes(filterValue)){          
          if(!isNew){
            isNew = false;           
            let index = filter.length -1;          
            filter[index].committee.push(this.committeeGroups[j].committee[i]);
          }else{
            filter.push(
              {
                jobTitle: this.committeeGroups[j].jobTitle,
                committee: [this.committeeGroups[j].committee[i]]
              },
            );
            isNew = false;
          }         
        }
        if(this.committeeGroups[j].committee.length - 1 == i){
          isNew = true;
        }
      }
    }
    return filter;
  }

  closeButton() {
    $('.mat-autocomplete-panel.mat-autocomplete-visible').css('visibility', 'hidden');
    $('.close-button').css('display', 'none');
    this.committeeControl.reset('');
    this.selectedHeads = null;
  }

  onSend(): void {
    var _result = {
      groupComment: this.groupComment.trim(),
      selectedHeads: this.selectedHeads,
      selectedFormatters : this.selectedFormatted
    };
    this.dialogRef.close({ event: 'Send', data: _result });
  }
  committeeChange(committee:any){
    this.selectedHeads = committee
    this.formattedFilteredOptions = this.formattedGroups
  }
  committeeFormattedChange(committee:any){
    this.selectedFormatted = committee;
  }
}
