import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TestService {
user: User = new User();
  constructor(private http:HttpClient, private  userService:UserService) { }

  refreshUser(): Observable<any> {
    return this.userService.getUserInfo().pipe(map(response => {
        //debugger;
        let x = response;
        if (x){
            this.user = x;
            //this.userContext.user.userFullName = x.userFullName || "";
            this.user.userLogin = x.userLogin || "";
            this.user.userDelegations = x.userDelegations || [];
            if(x.empDetails && x.empDetails.ecmUserName){
                this.user.userFullName = x.empDetails.ecmUserName ;
            }
        } 
    }));
}
}
