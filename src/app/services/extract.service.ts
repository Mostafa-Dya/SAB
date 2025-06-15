import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ObservationCard } from '../models/observationCard.model';
import { ConfigService } from './config.service';
import { ExtractionReport } from '../models/extractionReport.model';
import { LinkObservations } from '../models/link-observations.model';

@Injectable({
  providedIn: 'root'
})

export class ExtractService {
  launchUrl: string;
  searchUrl: string;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService) {
    this.launchUrl = configService.launchUrl;
    this.searchUrl = configService.searchontroller;
  }

  getObsToBeExtracted(): Observable<ExtractionReport> {
    return this.httpClient.get<ExtractionReport>(this.launchUrl + "getExtractionList");
  }

  getObsContent(obsId: string, reportToBeGenerated: string): Observable<ObservationCard> {
    return this.httpClient.get<ObservationCard>(this.searchUrl + "getObservationContent?obsId=" + obsId + "&reportToBeGenerated=" + reportToBeGenerated);
  }

  getObsContentByTitle(obsTitle: string, reportYear: string): Observable<ObservationCard[]> {
    return this.httpClient.get<ObservationCard[]>(this.searchUrl + "getObsContentByTitle?obsTitle=" + obsTitle + "&reportYear=" + reportYear);
  }

  extractAll(userId: string, reportToBeGenerated: string): Observable<string> {
    return this.httpClient.get<string>(this.launchUrl + "extractAll?userId=" + userId + "&reportToBeGenerated=" + reportToBeGenerated);
  }

  discardAll(userId: string, reportCycle: string): Observable<any> {
    return this.httpClient.get<string>(this.launchUrl + "discardLaunchedObs?userId=" + userId + "&reportCycle=" + reportCycle);
  }

  adjustObservation(observation: ObservationCard): Observable<ObservationCard> {
    return this.httpClient.post<ObservationCard>(this.launchUrl + "adjustObservation", observation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getPendingObsToLink(): Observable<LinkObservations> {
    return this.httpClient.get<LinkObservations>(this.launchUrl + "getPendingObservationToLink");
  }
  
  linkObservations(linkObs: LinkObservations): Observable<LinkObservations> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(linkObs);
    return this.httpClient.post<LinkObservations>(this.launchUrl + 'linkObservations', body, { 'headers': headers })
    // return this.httpClient.get<LinkObservations>(this.launchUrl+"linkObservations");
  }
}
