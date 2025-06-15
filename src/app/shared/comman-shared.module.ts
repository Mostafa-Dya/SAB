import { NgModule } from '@angular/core';
import { ApproveComponent } from '../components/approve/approve.component';
import { CancelSendBackComponent } from '../components/cancel-send-back/cancel-send-back.component';
import { UpdateResponseAdminComponent } from '../components/update-response-admin/update-response-admin.component';
import { ArchiveResponseNotesComponent } from '../components/archive-response-notes/archive-response-notes.component';
import { AssignToCommitteeComponent } from '../components/assign-to-committee/assign-to-committee.component';
import { AssignToExecutiveComponent } from '../components/assign-to-executive/assign-to-executive.component';
import { AssignToStaffComponent } from '../components/assign-to-staff/assign-to-staff.component';
import { AssignToSubExecutivesComponent } from '../components/assign-to-sub-executives/assign-to-sub-executives.component';
import { AttachmentListComponent } from '../components/attachment-list/attachment-list.component';
import { CombineResponsesComponent } from '../components/combine-responses/combine-responses.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { DeclineSendBackComponent } from '../components/decline-send-back/decline-send-back.component';
import { DepartmentAssignmentComponent } from '../components/department-assignment/department-assignment.component';
import { DepartmentTransferComponent } from '../components/department-transfer/department-transfer.component';
import { EmailDocumentComponent } from '../components/email-document/email-document.component';
import { OtherResponsesComponent } from '../components/other-responses/other-responses.component';
import { PastHistoryComponent } from '../components/past-history/past-history.component';
import { SelectSupervisorComponent } from '../components/select-supervisor/select-supervisor.component';
import { PreviousEntityTypeComponent } from '../components/previous-entity-type/previous-entity-type.component';
import { ReminderHistoryComponent } from '../components/reminder-history/reminder-history.component';
import { SendBackReasonsComponent } from '../components/sendback-reasons/sendback-reasons.component';
import { SendBackComponent } from '../components/send-back/send-back.component';
import { SendResponseBehalfComponent } from '../components/send-response-behalf/send-response-behalf.component';
import { SendResponseComponent } from '../components/send-response/send-response.component';
import { WorkingDepartmentListComponent } from '../components/working-department-list/working-department-list.component';
import { DraggableDialogDirective } from './draggable-dialog.directive';
import { SharedModule } from './shared.module';
import { EditDelegationDialogComponent } from '../components/delegation/edit-delegation-dialog/edit-delegation-dialog.component';
import { GPAContactDetailsModule } from '../components/g&pa-contact-details/g&pa-contact-details.module';
import { GPAMemberDetailsComponent } from '../components/g&pa-member-details/g&pa-member-details.component';
import { ContactPersonDetailsComponent } from '../components/contact-person-details/contact-person-details.component';
import { OverviewComponent } from '../components/overview/overview.component';
import { DeclinedByManagerComponent } from '../components/declined-by-manager/declined-by-manager.component';

import { ObservationContentComponent } from '../components/observation-content/observation-content.component';
import { AddCommentComponent } from '../components/add-comment/add-comment.component';
@NgModule({
  declarations: [
    CombineResponsesComponent,
    DeclinedByManagerComponent,
    DepartmentAssignmentComponent,
    AssignToStaffComponent,
    AssignToCommitteeComponent,
    AssignToExecutiveComponent,
    AssignToSubExecutivesComponent,
    SendResponseComponent,
    ConfirmationDialogComponent,
    EditDelegationDialogComponent,
    ApproveComponent,
    CancelSendBackComponent,
    UpdateResponseAdminComponent,
    PreviousEntityTypeComponent,
    DepartmentTransferComponent,
    SendResponseBehalfComponent,
    SendBackComponent,
    DeclineSendBackComponent,
    OtherResponsesComponent,
    PastHistoryComponent,
    SelectSupervisorComponent,
    EmailDocumentComponent,
    GPAMemberDetailsComponent,
    ContactPersonDetailsComponent,
    OverviewComponent,
    ReminderHistoryComponent,
    SendBackReasonsComponent,
    DraggableDialogDirective,
    AttachmentListComponent,
    ArchiveResponseNotesComponent,
    WorkingDepartmentListComponent,
    ObservationContentComponent,
    AddCommentComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    CombineResponsesComponent,
    DeclinedByManagerComponent,
    DepartmentAssignmentComponent,
    AssignToStaffComponent,
    AssignToCommitteeComponent,
    AssignToExecutiveComponent,
    AssignToSubExecutivesComponent,
    SendResponseComponent,
    ConfirmationDialogComponent,
    EditDelegationDialogComponent,
    ApproveComponent,
    CancelSendBackComponent,
    UpdateResponseAdminComponent,
    PreviousEntityTypeComponent,
    DepartmentTransferComponent,
    SendResponseBehalfComponent,
    SendBackComponent,
    DeclineSendBackComponent,
    OtherResponsesComponent,
    PastHistoryComponent,
    SelectSupervisorComponent,
    EmailDocumentComponent,
    GPAMemberDetailsComponent,
    ContactPersonDetailsComponent,
    ReminderHistoryComponent,
    SendBackReasonsComponent,
    DraggableDialogDirective
  ]
})
export class CommanSharedModule { }
