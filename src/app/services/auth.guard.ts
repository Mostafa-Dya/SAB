// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedVariableService } from './shared-variable.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private selectedDelegateUserInfo: any = null;

  // all the routes that only admins may visit
  private adminOnly = new Set([
    'escalation-settings',
    'users',
    'observations-per-department-report',
  ]);

  constructor(
    private sharedVariableService: SharedVariableService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    return this.checkUserLogin(route, state.url);
  }

  private checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    // Must be logged in
    if (!this.sharedVariableService.getLoginValue()) {
      return this.deny();
    }

    const isAdmin = this.sharedVariableService.getIsAdmin() ?? '';
    const userRole = this.sharedVariableService.getRole() ?? '';
    const userInformation = this.sharedVariableService.userInformation;
    this.loadDelegateInfo();

    const path = route.url[0]?.path;

    // map of path → handler
    const handlers: Record<string, () => boolean> = {
      'sent-items': () => this.canAccessSentItems(isAdmin),
      archive: () => this.deny(),
      'running-observations': () => this.deny(),
      delegation: () => this.canAccessDelegation(isAdmin, userInformation),
      'response-progress': () =>
        this.canAccessResponseProgress(route, isAdmin, userRole),
      'user-list-report': () => this.canAccessUserListReport(userInformation),
    };

    // 1) explicit handler
    if (path in handlers) {
      return handlers[path]();
    }

    // 2) admin-only group
    if (this.adminOnly.has(path)) {
      return this.canAccessAdminOnly(isAdmin);
    }

    // 3) fallback role guard
    if (
      route.data['role'] &&
      (route.data['role'] as string[]).indexOf(isAdmin) === -1
    ) {
      return this.deny();
    }

    return true;
  }

  private loadDelegateInfo(): void {
    const raw = localStorage.getItem('sabDelegateUser');
    if (raw) {
      this.selectedDelegateUserInfo = JSON.parse(raw);
    }
  }

  private deny(): boolean {
    this.router.navigate(['/inbox']);
    return false;
  }

  private canAccessSentItems(isAdmin: string): boolean {
    if (isAdmin === 'admin') {
      return this.deny();
    }
    return true;
  }

  private canAccessDelegation(isAdmin: string, info: any): boolean {
    // admins always; non-admins only if delegationAdminPageEnabled
    if (isAdmin !== 'admin' && !info.delegationAdminPageEnabled) {
      return this.deny();
    }
    return true;
  }

  private canAccessResponseProgress(
    route: ActivatedRouteSnapshot,
    isAdmin: string,
    userRole: string
  ): boolean {
    const delegate = this.selectedDelegateUserInfo;
    const job = delegate?.userJobTitle;
    const allowedRoles = route.data['role'] as string[] | undefined;

    // if roles restricted and current user/delegate not in them, block
    if (allowedRoles && allowedRoles.indexOf(isAdmin) === -1) {
      if (delegate) {
        if (job === 'ENG' || job === 'SENG') {
          return this.deny();
        }
        return true;
      }
      if (userRole === 'ENG' || userRole === 'SENG') {
        return this.deny();
      }
    }
    return true;
  }

  private canAccessAdminOnly(isAdmin: string): boolean {
    if (isAdmin !== 'admin') {
      return this.deny();
    }
    return true;
  }

  private canAccessUserListReport(info: any): boolean {
    const job = info.sabMember.userJobTitle;
    const supJob = info.supervisorDetails?.userJobTitle;
    const delegateJob = this.selectedDelegateUserInfo?.userJobTitle;

    if (
      info.admin ||
      job === 'MGR' ||
      (job === 'SEC' && supJob === 'MGR') ||
      delegateJob === 'MGR'
    ) {
      return true;
    }
    return false;
  }
}
