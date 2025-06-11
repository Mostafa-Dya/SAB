import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationCountReportComponent } from './classification-count-report.component';

describe('ClassificationCountReportComponent', () => {
  let component: ClassificationCountReportComponent;
  let fixture: ComponentFixture<ClassificationCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassificationCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
