import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationDetailsComponent } from './observation-details-reports.component';

describe('ObservationDetailsComponent', () => {
  let component: ObservationDetailsComponent;
  let fixture: ComponentFixture<ObservationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
