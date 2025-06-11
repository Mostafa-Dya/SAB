import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOrFinalObservationTitlesComponent } from './initial-or-final-observation-titles.component';

describe('InitialOrFinalObservationTitlesComponent', () => {
  let component: InitialOrFinalObservationTitlesComponent;
  let fixture: ComponentFixture<InitialOrFinalObservationTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialOrFinalObservationTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOrFinalObservationTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
