import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DelegationMessagesService {
  readonly addSuccess = 'Delegation added successfully';
  readonly updateSuccess = 'Delegation updated successfully';
  readonly updateError = 'Failed to update delegation';
}
