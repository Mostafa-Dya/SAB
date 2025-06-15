import { TestBed } from '@angular/core/testing';

import { SharedVariableService } from './shared-variable.service';

describe('SharedVariableService', () => {
  let service: SharedVariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedVariableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
