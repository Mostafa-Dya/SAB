import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListReportComponent } from './user-list-report.component';

describe('UserListReportComponent', () => {
  let component: UserListReportComponent;
  let fixture: ComponentFixture<UserListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
