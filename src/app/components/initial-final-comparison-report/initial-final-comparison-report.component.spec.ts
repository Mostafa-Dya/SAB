import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFinalComparisonReportComponent } from './initial-final-comparison-report.component';

describe('InitialFinalComparisonReportComponent', () => {
  let component: InitialFinalComparisonReportComponent;
  let fixture: ComponentFixture<InitialFinalComparisonReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialFinalComparisonReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialFinalComparisonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
