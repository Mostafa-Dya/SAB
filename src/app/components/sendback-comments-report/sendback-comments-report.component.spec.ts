import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBackCommentsReportComponent } from './sendback-comments-report.component';

describe('SendBackCommentsReportComponent', () => {
  let component: SendBackCommentsReportComponent;
  let fixture: ComponentFixture<SendBackCommentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendBackCommentsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBackCommentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
