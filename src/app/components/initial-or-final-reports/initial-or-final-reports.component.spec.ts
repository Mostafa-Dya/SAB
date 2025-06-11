import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOrFinalReportsComponent } from './initial-or-final-reports.component';

describe('InitialOrFinalReportsComponent', () => {
  let component: InitialOrFinalReportsComponent;
  let fixture: ComponentFixture<InitialOrFinalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialOrFinalReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOrFinalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
