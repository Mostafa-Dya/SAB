import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly baseUrl = environment.baseUrl;

  /** Controller endpoints */
  public readonly userUrl = `${this.baseUrl}UserController/`;
  public readonly inboxUrl = `${this.baseUrl}inboxController/`;
  public readonly workItemUrl = `${this.baseUrl}workItemController/`;
  public readonly launchObservationsUrl = `${this.baseUrl}launchObservations/`;
  public readonly searchUrl = `${this.baseUrl}SearchController/`;
  public readonly assignmentUrl = `${this.baseUrl}AssigmentsController/`;

  constructor() {}
}
