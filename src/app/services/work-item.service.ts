// src/app/services/work-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { InboxItem } from '../models/inbox-item.model';
import { ObsResponse } from '../models/obs-response.model';
import { WorkItem } from '../models/work-item.model';

@Injectable({
  providedIn: 'root',
})
export class WorkItemService {
  private readonly inboxBase: string;
  private readonly workItemBase: string;
  private readonly assignBase: string;
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private config: ConfigService) {
    this.inboxBase = config.inboxUrl;
    this.workItemBase = config.workItemUrl;
    this.assignBase = config.assignmentUrl;
  }

  /** GET array of work-items for given user */
  getWorkItemsList(userId: string): Observable<InboxItem[]> {
    const params = new HttpParams()
      .set('userLogin', userId)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<InboxItem[]>(`${this.inboxBase}getInboxWorkItems`, {
      params,
    });
  }

  /** Alias of getWorkItemsList (kept for compatibility) */
  getWorkItems(userId: string): Observable<InboxItem[]> {
    return this.getWorkItemsList(userId);
  }

  /** GET single work-item details by stepCustomId */
  getWorkItemInfo(stepCustomId: string): Observable<WorkItem> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<WorkItem>(`${this.workItemBase}getWorkDetailsInfo`, {
      params,
    });
  }

  /** ASSIGN to department */
  assignToDepartment(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.assignBase}assignToDepartments`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** ASSIGN to executive */
  assignToExecutive(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.assignBase}assignToExecutive`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** TRANSFER between departments */
  transferDepartment(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.assignBase}tansferDepartment`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** ASSIGN to staff */
  assignToStaff(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.assignBase}assignToStaff`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** ASSIGN to committee */
  assignToCommittee(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.assignBase}assignToCommittee`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** SEND a response on a work-item */
  sendResponse(
    stepCustomId: string,
    response: string
  ): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('stepResponse', response)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<ObsResponse>(`${this.workItemBase}sendResponse`, {
      params,
    });
  }

  /** COMBINE & approve in one action */
  approveAndCombineResponse(
    stepCustomId: string,
    response: string
  ): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('stepResponse', response)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<ObsResponse>(
      `${this.workItemBase}approveAndCombineResponse`,
      { params }
    );
  }

  /** APPROVE only */
  approveResponse(
    stepCustomId: string,
    response: string
  ): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('stepResponse', response)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<ObsResponse>(`${this.workItemBase}approveResponse`, {
      params,
    });
  }

  /** SEND to CEO & mark as exec */
  sendToCEOAndMarkObsAsExec(
    stepCustomId: string,
    userId: string
  ): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('userId', userId);
    return this.http.get<ObsResponse>(
      `${this.assignBase}sendToCEOAndMarkObsAsExec`,
      { params }
    );
  }

  /** GET existing response */
  getResponse(stepCustomId: string): Observable<ObsResponse> {
    const params = new HttpParams().set('stepCustomId', stepCustomId);
    return this.http.get<ObsResponse>(`${this.workItemBase}getResponse`, {
      params,
    });
  }

  /** DECLINE and send back */
  declineAndSendBack(stepCustomId: string): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<ObsResponse>(
      `${this.workItemBase}declineAndSendBack`,
      { params }
    );
  }

  /** SIMPLE send-back (without decline) */
  sendBack(stepCustomId: string): Observable<ObsResponse> {
    const params = new HttpParams()
      .set('stepCustomId', stepCustomId)
      .set('r', `${Math.random() * 100 + 100}`);
    return this.http.get<ObsResponse>(`${this.workItemBase}sendBack`, {
      params,
    });
  }

  /** RESPOND on behalf */
  respondOnBehalf(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.workItemBase}respondOnBehalf`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }

  /** COMBINE multiple responses */
  combineResponses(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.workItemBase}combineResponses`,
      JSON.stringify(payload),
      { headers: this.jsonHeaders }
    );
  }
}
