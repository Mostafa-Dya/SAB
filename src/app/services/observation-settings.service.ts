// observation-settings.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ObservalElement } from '../models/observal-element.model';

@Injectable({
  providedIn: 'root',
})
export class ObservationSettingsService {
  /** Immutable list of all possible observation settings. */
  private readonly _available: ObservalElement[] = [
    { year: '2021-2022', letter: 'A', observation: 1 },
    { year: '2021-2022', letter: 'B', observation: 1 },
    { year: '2021-2022', letter: 'BD', observation: 1 },
    { year: '2021-2022', letter: 'C', observation: 1 },
    { year: '2021-2022', letter: 'CD', observation: 1 },
    { year: '2021-2022', letter: 'E', observation: 1 },
    { year: '2021-2022', letter: 'ED', observation: 1 },
    { year: '2020-2021', letter: 'A', observation: 1.0079 },
    { year: '2020-2021', letter: 'B', observation: 4.0026 },
    { year: '2020-2021', letter: 'BD', observation: 6.941 },
    { year: '2020-2021', letter: 'C', observation: 9.0122 },
    { year: '2020-2021', letter: 'CD', observation: 9.0122 },
    { year: '2020-2021', letter: 'E', observation: 9.0122 },
    { year: '2020-2021', letter: 'ED', observation: 9.0122 },
    { year: '2019-2020', letter: 'A', observation: 1.0079 },
    { year: '2019-2020', letter: 'B', observation: 9.0122 },
    { year: '2019-2020', letter: 'BD', observation: 6.941 },
    { year: '2019-2020', letter: 'C', observation: 9.0122 },
    { year: '2019-2020', letter: 'CD', observation: 9.0122 },
    { year: '2019-2020', letter: 'E', observation: 9.0122 },
    { year: '2019-2020', letter: 'ED', observation: 9.0122 },
  ];

  /**
   * Returns a fresh copy of all available observations.
   * Using `of()` wraps it in an Observable so consumers can subscribe.
   */
  getAvailableObservations(): Observable<ObservalElement[]> {
    return of(this._available.slice());
  }
}
