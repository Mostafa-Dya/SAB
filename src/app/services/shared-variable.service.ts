// src/app/services/shared-variable.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface YearOption {
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedVariableService {
  private readonly _inboxCount = new BehaviorSubject<number>(0);
  private readonly _sabUserInfo = new BehaviorSubject<string>('');
  private readonly _responseInProgCount = new BehaviorSubject<number>(0);
  private readonly _isRtl = new BehaviorSubject<boolean>(false);
  private readonly _isDelegateUser = new BehaviorSubject<boolean>(false);
  private readonly _isUserInfoAvailable = new BehaviorSubject<boolean>(false);
  private readonly _isLoggedIn = new BehaviorSubject<boolean>(false);
  private readonly _reportYear = new BehaviorSubject<string>('');

  // === Public observables ===
  public readonly inboxCount$ = this._inboxCount.asObservable();
  public readonly sabUserInfo$ = this._sabUserInfo.asObservable();
  public readonly responseInProgCount$ =
    this._responseInProgCount.asObservable();
  public readonly isRtl$ = this._isRtl.asObservable();
  public readonly isDelegateUser$ = this._isDelegateUser.asObservable();
  public readonly isUserInfoAvailable$ =
    this._isUserInfoAvailable.asObservable();
  public readonly isLoggedIn$ = this._isLoggedIn.asObservable();
  public readonly reportYear$ = this._reportYear.asObservable();

  /** Raw user info loaded from localStorage */
  public userInformation: any = null;

  constructor() {
    // no-op
  }

  setRtlValue(value: boolean): void {
    this._isRtl.next(value);
  }

  // === Inbox count ===
  setInboxCount(count: number): void {
    this._inboxCount.next(count);
  }

  // === SAB user info (e.g. display name or JSON string) ===
  setSabUserInfo(info: string): void {
    this._sabUserInfo.next(info);
  }

  // === Responses In Progress count ===
  setResponseInProgCount(count: number): void {
    this._responseInProgCount.next(count);
  }

  // === RTL toggle ===
  setRtl(isRtl: boolean): void {
    this._isRtl.next(isRtl);
  }

  // === Delegate‐user flag ===
  setDelegateUser(isDelegate: boolean): void {
    this._isDelegateUser.next(isDelegate);
  }

  // === User‐info loaded flag ===
  setUserInfoAvailable(isAvailable: boolean): void {
    this._isUserInfoAvailable.next(isAvailable);
  }

  // === Login flag ===
  setLoggedIn(isLoggedIn: boolean): void {
    this._isLoggedIn.next(isLoggedIn);
  }

  // === Report year string ===
  setReportYear(year: string): void {
    this._reportYear.next(year);
  }

  // === Synchronous getters for legacy callers ===

  /** Get current login state synchronously */
  getLoginValue(): boolean {
    return this._isLoggedIn.getValue();
  }

  /** Get current admin status as 'admin' | 'notAdmin' for guards */
  getIsAdmin(): string {
    return this.isAdmin() ? 'admin' : 'notAdmin';
  }

  // === Role & admin checks (from localStorage) ===

  /** Returns the user's job title from localStorage */
  getRole(): string {
    return localStorage.getItem('userJobTitle') || '';
  }

  /** True if the parsed localStorage sabUserInformation.admin is truthy */
  isAdmin(): boolean {
    const raw = localStorage.getItem('sabUserInformation');
    if (!raw) return false;
    try {
      this.userInformation = JSON.parse(raw);
      return !!this.userInformation.admin;
    } catch {
      return false;
    }
  }

  // === Year‐list generators ===

  /**
   * Next `count` years starting at `startYear` (default: current calendar year).
   */
  getFutureYears(startYear?: number, count: number = 10): YearOption[] {
    const year0 = startYear ?? new Date().getFullYear();
    const years: YearOption[] = [];
    for (let i = 0; i <= count; i++) {
      const y = year0 + i;
      years.push({ date: `${y}-${y + 1}` });
    }
    return years;
  }

  /**
   * Previous `count` years ending at `endYear - 1` (default: last calendar year).
   */
  getPreviousYears(endYear?: number, count: number = 10): YearOption[] {
    const yearEnd = (endYear ?? new Date().getFullYear()) - 1;
    const years: YearOption[] = [];
    for (let i = 0; i <= count; i++) {
      const y = yearEnd - i;
      years.push({ date: `${y}-${y + 1}` });
    }
    return years;
  }

  /**
   * Legacy alias for getFutureYears().
   */
  async getYears(_: any): Promise<YearOption[]> {
    return Promise.resolve(this.getFutureYears());
  }

  /**
   * Alias for getFutureYears(startYear: number).
   */
  getYearsFromReport(startYear: number): YearOption[] {
    return this.getFutureYears(startYear);
  }
}
