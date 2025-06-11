import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToStaffComponent } from './assign-to-staff.component';

describe('AssignToStaffComponent', () => {
  let component: AssignToStaffComponent;
  let fixture: ComponentFixture<AssignToStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
