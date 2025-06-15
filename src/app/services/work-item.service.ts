import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { InboxItem } from '../models/inboxItem.model';
import { ConfigService } from './config.service';
import { WorkItem } from '../models/workItem.model';
import { ObsResponse } from '../models/response.model';
@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  baseUrl: string = "http://localhost:8087/SampleDBTest/api/getName";
  inboxUrl: string;
  workItemControllerUrl: string;
  assignmentControllerUrl: string;
  
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.inboxUrl = configService.inboxUrl;
    this.workItemControllerUrl = configService.workItemController;
    this.assignmentControllerUrl = configService.assignmentControllerUrl;
  }

  getWorkItems(userId: string) {
    return this.httpClient.get('http://localhost:9080/SABV2Services/Rest/inboxController/getInboxWorkItems?userLogin=GPAUserId');
  }

  getWorkItemsList(userId: string): Observable<InboxItem[]> {
    return this.httpClient.get<InboxItem[]>('http://localhost:9080/SABV2Services/Rest/inboxController/getInboxWorkItems?userLogin=GPAUserId');
  }

  getinboxItems(userId: string): Promise<any> {
    let URL = this.inboxUrl + "getInboxWorkItems?userLogin=" + userId + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get(URL).toPromise();
  }

  getWorkItemInfo1(workItemId: string): Observable<InboxItem[]> {
    return this.httpClient.get<InboxItem[]>('http://localhost:9080/SABV2Services/Rest/inboxController/getInboxWorkItems?userLogin=GPAUserId');
  }

  getWorkItemInfo(stepCustomId: string): Promise<WorkItem> {
    let URL = this.workItemControllerUrl + "getWorkDetailsInfo?stepCustomId=" + stepCustomId + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get<WorkItem>(URL).toPromise();
  }

  assignToDepartment(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.assignmentControllerUrl + 'assignToDepartments', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  assignToExecutive(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.assignmentControllerUrl + 'assignToExecutive', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  tansferDepartment(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.assignmentControllerUrl + 'tansferDepartment', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  assignToStaff(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.assignmentControllerUrl + 'assignToStaff', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  assignToCommittee(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.assignmentControllerUrl + 'assignToCommittee', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  sendResponse(stepCustomId: string, response: string): Observable<any> {
    let URL = this.workItemControllerUrl + "sendResponse?stepCustomId=" + stepCustomId + "&&stepResponse=" + response + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get<any>(URL);
  }

  approveAndCombineResponse(stepCustomId: string, response: string): Observable<any> {
    let URL = this.workItemControllerUrl + "approveAndCombineResponse?stepCustomId=" + stepCustomId + "&&stepResponse=" + response + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get<any>(URL);
  }

  approveResponse (stepCustomId: string,response: string):Observable<any>{
    let URL = this.workItemControllerUrl+"approveResponse?stepCustomId="+ stepCustomId+"&&stepResponse="+response+ "&r=" + ( Math.floor( Math.random() * 100 ) + 100 );
    return this.httpClient.get<any>( URL );
  }

  sendToCEOAndMarkObsAsExec(stepCustomId: string, userId: string): Observable<ObsResponse> {
    // let URL = this.userURL + "getDepartments" + "?r=" + ( Math.floor( Math.random() * 100 ) + 100 );
    let URL = this.assignmentControllerUrl + "sendToCEOAndMarkObsAsExec?stepCustomId=" + stepCustomId + "&&userId=" + userId;
    let x = this.httpClient.get<ObsResponse>(URL);
    return x;
  }

  getResponse(stepCustomId: string): Observable<ObsResponse> {
    // let URL = this.userURL + "getDepartments" + "?r=" + ( Math.floor( Math.random() * 100 ) + 100 );
    let URL = this.workItemControllerUrl + "getResponse?stepCustomId=" + stepCustomId;
    let x = this.httpClient.get<ObsResponse>(URL);
    return x;
  }

  declineAndSendBack(stepCustomId: string): Observable<any> {
    let URL = this.workItemControllerUrl + "declineAndSendBack?stepCustomId=" + stepCustomId + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get<any>(URL);
  }

  sendBack(stepCustomId: string): Observable<any> {
    let URL = this.workItemControllerUrl + "sendBack?stepCustomId=" + stepCustomId + "&r=" + (Math.floor(Math.random() * 100) + 100);
    return this.httpClient.get<any>(URL);
  }

  respondOnBhalf(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.workItemControllerUrl + 'respondOnBehalf', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }

  combineResponses(result: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(result);
    return this.httpClient.post<any>(this.workItemControllerUrl + 'combineResponses', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }
}