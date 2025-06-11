import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentTransferComponent } from './department-transfer.component';

describe('DepartmentTransferComponent', () => {
  let component: DepartmentTransferComponent;
  let fixture: ComponentFixture<DepartmentTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
