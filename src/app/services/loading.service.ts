import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /** Emits `true` whenever any requests are in flight, `false` otherwise */
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> = this._loading$.asObservable();

  /** Tracks URLs of all currently in-flight requests */
  private readonly inFlight = new Set<string>();

  /**
   * Call this at the start and end of each HTTP request.
   * @param loading  true to mark the request as in-flight, false to clear it
   * @param url      the unique request URL (must be non-empty)
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error(
        'LoadingService: a non-empty URL must be provided to setLoading()'
      );
    }

    if (loading) {
      this.show(url);
    } else {
      this.hide(url);
    }
  }

  /** Mark a request as started */
  private show(url: string): void {
    this.inFlight.add(url);
    if (!this._loading$.value) {
      this._loading$.next(true);
    }
  }

  /** Mark a request as finished */
  private hide(url: string): void {
    this.inFlight.delete(url);
    if (this.inFlight.size === 0 && this._loading$.value) {
      this._loading$.next(false);
    }
  }
}
