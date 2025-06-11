import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationChangeReportComponent } from './classification-change-report.component';

describe('ClassificationChangeReportComponent', () => {
  let component: ClassificationChangeReportComponent;
  let fixture: ComponentFixture<ClassificationChangeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassificationChangeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationChangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
