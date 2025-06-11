// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ConfigService } from './config.service';

import { User } from '../models/user.model';
import { Directorate } from '../models/directorate.model';
import { Department } from '../models/department.model';
import { CommitteeUsers } from '../models/committee-users.model';
import { ExecutiveUsers } from '../models/executive-users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.baseUrl = config.userUrl;
  }

  /** Generic error handler */
  private handleError(error: HttpErrorResponse) {
    console.error('UserService error', error);
    return throwError(
      () => new Error('An error occurred; please try again later.')
    );
  }

  getUserInfo(cacheBust: boolean = true): Observable<User> {
    let params = new HttpParams();
    if (cacheBust) {
      params = params.set('r', `${Math.random() * 100 + 100}`);
    }
    return this.http
      .get<User>(`${this.baseUrl}getUserInfo`, { params })
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * GET all directorates & their departments for a given user/workflow
   */
  getDepartments(
    userId: string,
    obsId: string,
    stepCustomId: string,
    reportCycle: string
  ): Observable<Directorate[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('obsId', obsId)
      .set('stepCustomId', stepCustomId)
      .set('reportCycle', reportCycle);

    return this.http
      .get<Directorate[]>(`${this.baseUrl}getDepartments`, { params })
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * GET all staff members under a manager for a given observation step
   */
  getStaffMembers(
    managerUserId: string,
    obsId: string,
    stepCustomId: string,
    deptCycleId: string
  ): Observable<Department> {
    const params = new HttpParams()
      .set('managerUserId', managerUserId)
      .set('obsId', obsId)
      .set('stepCustomId', stepCustomId)
      .set('deptCycleId', deptCycleId);

    return this.http
      .get<Department>(`${this.baseUrl}getStaffMembers`, { params })
      .pipe(retry(1), catchError(this.handleError));
  }

  /** GET the list of all committee users */
  getCommitteeUsers(): Observable<CommitteeUsers[]> {
    const params = new HttpParams().set('r', `${Math.random() * 100 + 100}`);
    return this.http
      .get<CommitteeUsers[]>(`${this.baseUrl}getCommitteeUsers`, { params })
      .pipe(retry(1), catchError(this.handleError));
  }

  /** GET the list of all executive users */
  getExecutiveUsers(): Observable<ExecutiveUsers[]> {
    const params = new HttpParams().set('r', `${Math.random() * 100 + 100}`);
    return this.http
      .get<ExecutiveUsers[]>(`${this.baseUrl}getExecutiveUsers`, { params })
      .pipe(retry(1), catchError(this.handleError));
  }
}
