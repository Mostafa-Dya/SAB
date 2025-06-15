import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVariableService {
  private inboxCount: BehaviorSubject<any>;
  private sabUserInfo = new Subject<string>();
  private responseInprogCount: BehaviorSubject<any>;
  private isRtl: BehaviorSubject<any>;
  private isDelegateUser: BehaviorSubject<any>;
  private isUserInfoAvailable: BehaviorSubject<any>;
  private isLogin: BehaviorSubject<any>;

  sabUserInfo$ = this.sabUserInfo.asObservable();
  roleAs: string | null;
  userInformation: any;
  isAdmin: any;
  private reportYear: BehaviorSubject<any>;

  constructor() {
    this.inboxCount = new BehaviorSubject<any>(0);
    this.sabUserInfo = new BehaviorSubject<any>('');
    this.sabUserInfo$ = new BehaviorSubject<any>('');

    this.responseInprogCount = new BehaviorSubject<any>(0);
    this.isRtl = new BehaviorSubject<any>(false);
    this.isDelegateUser = new BehaviorSubject<any>(false);
    this.isUserInfoAvailable = new BehaviorSubject<any>(false);
    this.isLogin = new BehaviorSubject<any>(false);    
    this.reportYear = new BehaviorSubject<any>('');
  }

  getValue(): Observable<any> {
    return this.inboxCount.asObservable();
  }

  setValue(count: any): void {
    this.inboxCount.next(count);
  }

  getSABUserInfo(): Observable<any> {
    return this.sabUserInfo.asObservable();
  }

  setSABUserInfo(count: any): void {
    this.sabUserInfo.next(count);
  }

  getResponseInProgValue(): Observable<any> {
    return this.responseInprogCount.asObservable();
  }

  setResponseInProgValue(count: any): void {
    this.responseInprogCount.next(count);
  }

  getRtlValue(): Observable<any> {
    return this.isRtl.asObservable();
  }

  setRtlValue(value: any): void {
    this.isRtl.next(value);
  }

  getDelegateUserValue(): Observable<any> {
    return this.isDelegateUser.asObservable();
  }

  setDelegateUserValue(value: any): void {
    this.isDelegateUser.next(value);
  }

  getUserInfoAvailable(): Observable<any> {
    return this.isUserInfoAvailable.asObservable();
  }

  setUserInfoAvailable(value: any): void {
    this.isUserInfoAvailable.next(value);
  }

  getLoginValue(): Observable<any> {
    return this.isLogin.asObservable();
  }

  setLoginValue(value: any): void {
    this.isLogin.next(value);
  }

  getRole() {
    this.roleAs = localStorage.getItem('userJobTitle');
    return this.roleAs;
  }

  getIsAdmin() {
    let data: any = localStorage.getItem('sabUserInformation');
    if(data){
      this.userInformation = JSON.parse(data);
      this.isAdmin = this.userInformation['admin'];
      if (this.isAdmin) {
        return "admin";
      }
    }
    return "notAdmin";
  }

  getReportYearValue(): Observable<any> {
    return this.reportYear.asObservable();
  }

  setReportYearValue(val: any): void {
    this.reportYear.next(val);
  }
  getYears(currentYear:any){
    let year= [];
    currentYear = new Date().getFullYear();
    year.push({date :`${currentYear }-${currentYear + 1}`});
    for(let i = 1 ; i <= 10 ;i++){
      year.push({date :`${currentYear + i}-${currentYear +( i + 1)}`});
    }
    return year;
  }

  getPreviousYears(currentYear:any){
    let year= [];
    currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i >= currentYear - 11; i--) {
      const previousYear = i;
      year.push({date :`${previousYear}-${previousYear + 1}`});
    }
    return year;
  }

  getYearsFromReport(currentYear:any){
    let year= [];
    // currentYear = new Date().getFullYear();
    year.push({date :`${currentYear }-${currentYear + 1}`});
    for(let i = 1 ; i <= 10 ;i++){
      year.push({date :`${currentYear + i}-${currentYear +( i + 1)}`});
    }
    return year;
  }
}
