import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchReportsComponent } from './launch-reports.component';

describe('LaunchReportsComponent', () => {
  let component: LaunchReportsComponent;
  let fixture: ComponentFixture<LaunchReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
