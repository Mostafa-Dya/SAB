import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAssignmentComponent } from './department-assignment.component';

describe('DepartmentAssignmentComponent', () => {
  let component: DepartmentAssignmentComponent;
  let fixture: ComponentFixture<DepartmentAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
