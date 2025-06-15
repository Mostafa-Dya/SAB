import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { delay } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sab-ui-v2';
  loading: boolean = false;
  isError =false;
  constructor(
    private _loading: LoadingService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._router.events.subscribe((v:any) => this.navigationInterceptor(v));
    this.listenToLoading();
  }

  foundError(error:any){
    this.isError = true
  }
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
        this.loading = true;
    }
    if (event instanceof NavigationEnd) {
        this.loading = false;
    }
    if (event instanceof NavigationCancel) {
        this.loading = false;
    }
    if (event instanceof NavigationError) {
        this.loading = false;
    }
  }
}
