// launch-reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { ExtractionReport } from '../models/extraction-report.model';

@Injectable({
  providedIn: 'root',
})
export class LaunchReportsService {
  private readonly base;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = this.config.launchObservationsUrl;
  }

  /**
   * Kick off the initial report launch.
   * @param formData multipart/form-data payload
   */
  launchReport(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.base}launchIntialReport`, formData);
  }

  /**
   * (Stub) Fetch the list of observations eligible for launching.
   * You'll need to fill in the correct endpoint & return type.
   */
  getObsListForLaunch(): Observable<ExtractionReport[]> {
    return this.http.get<ExtractionReport[]>(`${this.base}getObsListForLaunch`);
  }
}
