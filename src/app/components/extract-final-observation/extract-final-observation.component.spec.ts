import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractFinalObservationComponent } from './extract-final-observation.component';

describe('ExtractFinalObservationComponent', () => {
  let component: ExtractFinalObservationComponent;
  let fixture: ComponentFixture<ExtractFinalObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractFinalObservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractFinalObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
