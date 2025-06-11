import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDepartmentComponent } from './change-department.component';

describe('ChangeDepartmentComponent', () => {
  let component: ChangeDepartmentComponent;
  let fixture: ComponentFixture<ChangeDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
