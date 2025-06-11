import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRunningObservationDetailsComponent } from './search-running-observation-details.component';

describe('SearchRunningObservationDetailsComponent', () => {
  let component: SearchRunningObservationDetailsComponent;
  let fixture: ComponentFixture<SearchRunningObservationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRunningObservationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRunningObservationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
