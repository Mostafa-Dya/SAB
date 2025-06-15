import { TestBed } from '@angular/core/testing';

import { ObservationSettingsService } from './observation-settings.service';

describe('ObservationSettingsService', () => {
  let service: ObservationSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservationSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
