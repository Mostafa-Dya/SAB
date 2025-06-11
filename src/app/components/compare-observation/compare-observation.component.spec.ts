import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareObservationComponent } from './compare-observation.component';

describe('CompareObservationComponent', () => {
  let component: CompareObservationComponent;
  let fixture: ComponentFixture<CompareObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareObservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
