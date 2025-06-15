import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchivedObservationsRoutingModule } from './archived-observations-routing.module';
import { ArchivedObservationsComponent } from './archived-observations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArchivedObservationDetailsComponent } from '../archived-observation-details/archived-observation-details.component';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { ArchiveResponseNotesComponent } from '../archive-response-notes/archive-response-notes.component';

@NgModule({
  declarations: [
    ArchivedObservationsComponent,
    ArchivedObservationDetailsComponent
  ],
  imports: [
    CommonModule,
    ArchivedObservationsRoutingModule,
    SharedModule
  ]
})
export class ArchivedObservationsModule { }
