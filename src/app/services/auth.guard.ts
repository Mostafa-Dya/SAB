import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedVariableService } from './shared-variable.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  selectedDelegateUserInfo: any;
  constructor(
    private sharedVariableService: SharedVariableService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(route, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.sharedVariableService.getLoginValue()) {
      const userRole = this.sharedVariableService.getRole();
      const isAdmin = this.sharedVariableService.getIsAdmin();
      const userInformation = this.sharedVariableService.userInformation;
      let data: any = localStorage.getItem('sabDelegateUser');
      if (data) {
        this.selectedDelegateUserInfo = JSON.parse(data);
      }
      if (route.url[0].path == 'sent-items') {
        if (isAdmin == 'admin') {
          this.router.navigate(['/inbox']);
          return false;
        }
        return true;
      } else if (route.url[0].path == 'archive' || route.url[0].path == 'running-observations') {
        this.router.navigate(['/inbox']);
        return false;
      } else if (route.url[0].path == 'delegation' && (isAdmin != 'admin' ||  (isAdmin == 'admin' && userInformation.delegationAdminPageEnabled))) {
        // if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        return true;
        // }
        // this.router.navigate(['/inbox']);
        // return false;
      } else if (route.url[0].path == 'response-progress') {
        let data: any = localStorage.getItem('sabDelegateUser');
        if (data) {
          this.selectedDelegateUserInfo = JSON.parse(data);
          if (route.data.role && route.data.role.indexOf(isAdmin) === -1) {
            if (this.selectedDelegateUserInfo.userJobTitle == 'ENG' || this.selectedDelegateUserInfo.userJobTitle == 'SENG') {
              this.router.navigate(['/inbox']);
              return false;
            }
            return true;
          }
          return true;
        } else {
          if (route.data.role && route.data.role.indexOf(isAdmin) === -1) {
            if (userRole == 'ENG' || userRole == 'SENG') {
              this.router.navigate(['/inbox']);
              return false;
            }
            return true;
          }
          return true;
        }
      } else if (route.url[0].path == 'escalation-settings') {
        if (isAdmin != 'admin') {
          this.router.navigate(['/inbox']);
          return false;
        }
        return true;
      }
      else if (route.url[0].path == 'users') {
        if (isAdmin != 'admin') {
          this.router.navigate(['/inbox']);
          return false;
        }
        return true;
      } else if (route.url[0].path == 'observations-per-department-report') {
        if (isAdmin != 'admin') {
          this.router.navigate(['/inbox']);
          return false;
        }
        return true;
      }if (route.url[0].path == 'user-list-report'){
        if(userInformation.admin || userInformation.sabMember.userJobTitle == 'MGR' || ( userInformation.sabMember.userJobTitle == 'SEC' && userInformation.supervisorDetails.userJobTitle == 'MGR' )|| ( this.selectedDelegateUserInfo && this.selectedDelegateUserInfo.userJobTitle == 'MGR' )){
          return true;
        }else{
          return false;
        }
      }
      // if (route.url[0].path == 'pending-observations-report'){
      //   if(
      //     userInformation.sabMember.userJobTitle == 'DCEO' || userInformation.sabMember.userJobTitle == 'CEO' || (userInformation.sabMember.userJobTitle == 'SEC' &&   (userInformation.supervisorDetails.userJobTitle == 'DCEO' || 
      //     userInformation.supervisorDetails.userJobTitle == 'CEO' ))
      //   ){
      //     return true;
      //   }else{
      //     return false;
      //   }
      // }
      else if (route.data.role && route.data.role.indexOf(isAdmin) === -1) {
        this.router.navigate(['/inbox']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/inbox']);
    return false;
  }
}
