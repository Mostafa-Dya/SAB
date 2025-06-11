import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { ExtractionReport } from '../models/extraction-report.model';
import { ObservationCard } from '../models/observation-card.model';
import { LinkObservations } from '../models/link-observations.model';

@Injectable({
  providedIn: 'root',
})
export class ExtractService {
  private readonly launchUrl: string;
  private readonly searchUrl: string;
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private config: ConfigService) {
    this.launchUrl = config.launchObservationsUrl;
    this.searchUrl = config.searchUrl;
  }

  /** Fetch the list of extractions */
  getObsToBeExtracted(): Observable<ExtractionReport> {
    return this.http.get<ExtractionReport>(
      `${this.launchUrl}getExtractionList`
    );
  }

  /** Fetch a specific observation content by ID and report type */
  getObsContent(
    obsId: string,
    reportToBeGenerated: string
  ): Observable<ObservationCard> {
    const params = new HttpParams()
      .set('obsId', obsId)
      .set('reportToBeGenerated', reportToBeGenerated);

    return this.http.get<ObservationCard>(
      `${this.searchUrl}getObservationContent`,
      { params }
    );
  }

  /** Fetch observations by title and year */
  getObsContentByTitle(
    obsTitle: string,
    reportYear: string
  ): Observable<ObservationCard[]> {
    const params = new HttpParams()
      .set('obsTitle', obsTitle)
      .set('reportYear', reportYear);

    return this.http.get<ObservationCard[]>(
      `${this.searchUrl}getObsContentByTitle`,
      { params }
    );
  }

  /** Trigger “extract all” action */
  extractAll(userId: string, reportToBeGenerated: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('reportToBeGenerated', reportToBeGenerated);

    return this.http.get<string>(`${this.launchUrl}extractAll`, { params });
  }

  /** Discard all launched observations */
  discardAll(userId: string, reportCycle: string): Observable<void> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('reportCycle', reportCycle);

    // assuming server returns no content
    return this.http.get<void>(`${this.launchUrl}discardLaunchedObs`, {
      params,
    });
  }

  /** Adjust a single observation */
  adjustObservation(observation: ObservationCard): Observable<ObservationCard> {
    return this.http.post<ObservationCard>(
      `${this.launchUrl}adjustObservation`,
      observation,
      { headers: this.jsonHeaders }
    );
  }

  /** Get pending observations for linking */
  getPendingObsToLink(): Observable<LinkObservations> {
    return this.http.get<LinkObservations>(
      `${this.launchUrl}getPendingObservationToLink`
    );
  }

  /** Link two observations together */
  linkObservations(linkObs: LinkObservations): Observable<LinkObservations> {
    return this.http.post<LinkObservations>(
      `${this.launchUrl}linkObservations`,
      linkObs,
      { headers: this.jsonHeaders }
    );
  }
}
