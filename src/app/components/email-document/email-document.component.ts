import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { AssignToCommitteeComponent } from '../assign-to-committee/assign-to-committee.component';
import { COMMA, ENTER, J } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as ClassicEditor from '../../../../public/assets/js/ck-editor-plugin/ckeditor';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-email-document',
  templateUrl: './email-document.component.html',
  styleUrls: ['./email-document.component.css']
})
export class EmailDocumentComponent implements OnInit {
  isRtl: any;
  visible = true;
  selectable = true;
  removable = true;
  attachmentSheetName: string ='Observation.doc';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  toCtrl = new FormControl();
  ccCtrl = new FormControl();
  filteredTo: Observable<any[]>;
  filteredCC: Observable<any[]>;
  to: any[] = [];
  cc: any[] = [];
  selectedTo: any = [];
  selectedCc: any = [];
  filtered: any = [];
  allTo: any = [];
  subject = '';
  filteredData: any;
  userInformation: any;
  public Editor = ClassicEditor;
  public model = {
    editorData: ''
  };
  config = {
    toolbar: ['bold', 'underline', '|', 'bulletedList', '|', 'undo', 'redo'],
    language: 'ar'
  }

  @ViewChild('toInput') toInput: ElementRef<HTMLInputElement>;
  @ViewChild('ccInput') ccInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AssignToCommitteeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedVariableService: SharedVariableService, private coreService: CoreService
  ) {
    dialogRef.disableClose = true;
    this.filteredTo = this.toCtrl.valueChanges.pipe(
      startWith(null),
      map((to) => (to ? this._filter(to) : [])),
    );
    this.filteredCC = this.ccCtrl.valueChanges.pipe(
      startWith(null),
      map((to) => (to ? this._filter(to) : [])),
    );
  }

  ngOnInit(): void {
    if(this.data && this.data.id=='OverViewSheet'){
     this.attachmentSheetName =  'OverViewSheet.doc';
    }
    
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.allTo = this.data.response;
    for(let i = 0 ; i< this.allTo.length ; i++){
      if(this.allTo[i].loginId == 'ecmadmin'){
        this.allTo.splice(i, 1);
        break;
      }
    }
    this.allTo.sort((a:any, b:any) => {
      let fa = a.userName.toLowerCase(),
        fb = b.userName.toLowerCase();
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
  }

  _filter(value: string) {
    if (typeof value == 'string') {
      const filterValue = value.toLowerCase();
      let filter = this.allTo.filter((to: any) => to.userMail.toLowerCase().includes(filterValue) || to.userName.toLowerCase().includes(filterValue) || to.loginId.toLowerCase().includes(filterValue));
      return this.filterData(filter)
    } else {
      let filter = JSON.parse(JSON.stringify(this.allTo))
      filter = this.filterData(filter);
      return [];
    }
  }

  filterData(filter: any) {
    // this.isDialogLoading = false;
    let filtered = [...filter];
  for (let i = 0; i < this.to.length; i++) {
    for (let f = 0; f < filtered.length; f++) {
      if (filtered[f].userMail == this.to[i].userMail ) {
        filtered.splice(f, 1);
        // this.filtered = filter
        break;
      }
      if (filter.length == 0) {
        break;
      }
    }
  }
  for (let j = 0; j < this.cc.length; j++) {
    for (let f = 0; f < filtered.length; f++) {
      if (filtered[f].userMail == this.cc[j].userMail) {
        filtered.splice(f, 1);
        // this.filtered = filter;
        break;
      }
      if (filter.length == 0) {
        break;
      }
    }
  }
  // this.filtered = filter

  
  return filtered;
}

onChange(val: any) {
  let key = this.toCtrl.value;
  if (typeof key != "object" && key.trim().length >= 3) {
    let url = 'UserController/';
    url = url + 'getSabEmployees?userName=' + this.toCtrl.value;
    this.filteredData = this.coreService.get(url).pipe(
      map(response => this.filterData(response)),
    );
    // this.filteredData = this.coreService.get(url).subscribe(response => {
    //   return this.filterData(response);
    //   // this.filteredData= this.filterData(response);
    //   // this.filterData(response);
    // },
    // // this.filteredData = this.coreService.get(url).pipe(
    // //   map(response => this.filterData(response))
    // // );
    // error => {
    //   return []
    //   console.log('error :', error);
    // })
  }
}


onChangeToCC(val: any) {
  let key = this.ccCtrl.value;
  if (typeof key != "object" && key.trim().length >= 3) {
    let url = 'UserController/';
    url = url + 'getSabEmployees?userName=' + this.ccCtrl.value;
    this.filteredCC = this.coreService.get(url).pipe(
      map(response => this.filterData(response)),
    );

  //   this.filteredCC = this.coreService.get(url).subscribe(response => {
  //     return this.filterData(response);
  //   }, error => {
  //     return []
  //     console.log('error :', error);
  //   })
   }
}

  add(event: MatChipInputEvent): void {
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //   // Add our fruit
    //   if ((value || '').trim()) {
    //     this.allTo.map((key: any, i: any) => {
    //       if (key.userMail == value.trim()) {
    //         this.allTo[i].isSelected = true;
    //         this.to.push(key);
    //       }
    //     })
    //   }
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //   this.toCtrl.setValue(null);
    // }
  }

  addCC(event: MatChipInputEvent): void {
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //   // Add our fruit
    //   if ((value || '').trim()) {
    //     this.allTo.map((key: any, i: any) => {
    //       if (key.userMail == value.trim()) {

    //         // this.selectedTo.push(key)
    //       }
    //     })
    //   }
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //   this.ccCtrl.setValue(null);
    // }
  }

  remove(to: any): void {
    const index =  this.to.map(function(e) { return e.userMail; }).indexOf(to.userMail);
    if (index >= 0) {
      this.to.splice(index, 1);
      for (let i = 0; i < this.selectedTo.length; i++) {
        if (this.selectedTo.userMail == to.userMail) {
          this.selectedTo.splice(i, 1)
          return;
        }
      }
    }
  }

  removeCC(to: any): void {
    const index =  this.cc.map(function(e) { return e.userMail; }).indexOf(to.userMail);
    if (index >= 0) {
      this.cc.splice(index, 1);
      for (let i = 0; i < this.selectedTo.length; i++) {
        if (this.selectedCc.userMail == to.userMail) {
          this.selectedCc.splice(i, 1)
          return;
        }
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
   
    this.to.push(event.option.value);
    this.toInput.nativeElement.value = '';
    this.toCtrl.setValue(null);
    this.selectedTo.push(this.filtered.filter((to: any) => to.userMail.toLowerCase().includes(event.option.value.userMail))[0]);
  }

  selectedCC(event: MatAutocompleteSelectedEvent): void {
    this.cc.push(event.option.value);
    this.ccInput.nativeElement.value = '';
    this.ccCtrl.setValue(null);
    this.selectedCc.push(this.filtered.filter((to: any) => to.userMail.toLowerCase().includes(event.option.value.userMail))[0]);
  }

  sendMail(): void {
    let to = [];
    let cc = [];
    for(let i = 0;i< this.to.length ;i++){
      to.push(this.to[i].userMail)
    }
    for(let i = 0;i< this.cc.length ;i++){
      cc.push(this.cc[i].userMail)
    }
    var _result = {
      body: this.model.editorData.trim(),
      subject: this.subject,
      toMailIds: to,
      ccMailIds: cc
    };
     this.dialogRef.close({ event: 'Send', data: _result });
  }
}
