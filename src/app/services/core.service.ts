import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  get<T>(
    path: string,
    options?: { params?: HttpParams | Record<string, string | string[]> }
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, options);
  }

  post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.post<T>(this.baseUrl + endpoint, body, { headers });
  }

  /**
   * Simple PUT, with optional headers.
   */
  put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.put<T>(this.baseUrl + endpoint, body, { headers });
  }

  /**
   * Simple PATCH, with optional headers.
   */
  patch<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.patch<T>(this.baseUrl + endpoint, body, { headers });
  }

  /**
   * Simple DELETE, with optional query params & headers.
   */
  delete<T>(
    endpoint: string,
    params?: HttpParams | { [param: string]: string | string[] },
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.delete<T>(this.baseUrl + endpoint, { params, headers });
  }
}
