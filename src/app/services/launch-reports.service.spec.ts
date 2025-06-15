import { TestBed } from '@angular/core/testing';

import { LaunchReportsService } from './launch-reports.service';

describe('LaunchReportsService', () => {
  let service: LaunchReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
