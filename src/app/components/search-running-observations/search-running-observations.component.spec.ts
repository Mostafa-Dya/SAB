import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRunningObservationsComponent } from './search-running-observations.component';

describe('SearchRunningObservationsComponent', () => {
  let component: SearchRunningObservationsComponent;
  let fixture: ComponentFixture<SearchRunningObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRunningObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRunningObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
