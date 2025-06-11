import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
import { SendResponseComponent } from '../send-response/send-response.component';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../../public/assets/js/ck-editor-plugin/ckeditor';
import { MatTableDataSource } from '@angular/material/table';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';
import { isArray } from 'lodash';

interface DateStrings {
  date: string;
}

export interface Entities {
  name: string;
}

@Component({
  selector: 'app-observation-content',
  templateUrl: './observation-content.component.html',
  styleUrls: ['./observation-content.component.css']
})
export class ObservationContentComponent implements OnInit {
  isRtl: any;
  constructor(
    public dialogRef: MatDialogRef<SendResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService,
    public dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
   
  }

  
}
