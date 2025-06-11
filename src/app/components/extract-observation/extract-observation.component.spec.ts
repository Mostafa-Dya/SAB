import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractObservationComponent } from './extract-observation.component';

describe('ExtractObservationComponent', () => {
  let component: ExtractObservationComponent;
  let fixture: ComponentFixture<ExtractObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractObservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
