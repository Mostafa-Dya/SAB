import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractObservationRoutingModule } from './extract-observation-routing.module';
import { ExtractObservationComponent } from './extract-observation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { LinkObservationsComponent } from '../link-observations/link-observations.component';
import { CompareObservationComponent, InformationDialog } from '../compare-observation/compare-observation.component';
import { InitialFinalComparisonReportComponent } from '../initial-final-comparison-report/initial-final-comparison-report.component';
import { ExtractFinalObservationComponent } from '../extract-final-observation/extract-final-observation.component';
import { ArchivedResponseContentComponent } from '../archived-response-content/archived-response-content.component';

@NgModule({
  declarations: [
    ExtractObservationComponent,
    ExpandContentComponent,
    ArchivedResponseContentComponent,
    LinkObservationsComponent,
    CompareObservationComponent,
    InitialFinalComparisonReportComponent,
    InformationDialog,
    ExtractFinalObservationComponent
  ],
  imports: [
    CommonModule,
    ExtractObservationRoutingModule,
    SharedModule
  ]
})
export class ExtractObservationModule { }
