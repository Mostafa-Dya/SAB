import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { User } from '../models/user.model';
import { Directorate } from '../models/directorate.model';
import { Department } from '../models/department.model';
import { CommitteeUsers } from '../models/committee-users.model';
import { ExecutiveUsers } from '../models/executive-users.model';
import { SabMember } from '../models/sab-member.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userURL: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.userURL = configService.userURL;
  }

  getUserInfo(): Observable<User> {
    let URL = this.userURL + "getUserInfo" + "?r=" + (Math.floor(Math.random() * 100) + 100);
    let x = this.http.get<User>(URL);
    return x;
  }

  getDepartments(userId: string, obsId: string, stepCustomId: string, reportCycle: string): Observable<Directorate[]> {
    // let URL = this.userURL + "getDepartments" + "?r=" + ( Math.floor( Math.random() * 100 ) + 100 );
    let URL = this.userURL + "getDepartments?userId=" + userId + "&&obsId=" + obsId + "&&stepCustomId=" + stepCustomId + "&&reportCycle=" + reportCycle;
    let x = this.http.get<Directorate[]>(URL);
    return x;
  }

  //,departmentName:string,departmentCode:number
  getStaffMembers(managerUserId: string, obsId: string, stepCustomId: string, deptCycleId: string): Observable<Department> {
    // let URL = this.userURL + "getStaffMembers?managerUserId="+managerUserId;   
    let URL = this.userURL + "getStaffMembers?managerUserId=" + managerUserId + "&&obsId=" + obsId + "&&stepCustomId=" + stepCustomId + "&&deptCycleId=" + deptCycleId;
    let x = this.http.get<Department>(URL);
    return x;
  }

  getCommitteeUsers(): Observable<CommitteeUsers[]> {
    let URL = this.userURL + "getCommitteeUsers" + "?r=" + (Math.floor(Math.random() * 100) + 100);
    let x = this.http.get<CommitteeUsers[]>(URL);
    return x;
  }

  getExecutiveUsers(): Observable<ExecutiveUsers[]> {
    let URL = this.userURL + "getExecutiveUsers" + "?r=" + (Math.floor(Math.random() * 100) + 100);
    let x = this.http.get<ExecutiveUsers[]>(URL);
    return x;
  }
}
