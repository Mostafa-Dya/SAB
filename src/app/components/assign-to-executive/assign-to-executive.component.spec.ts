import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToExecutiveComponent } from './assign-to-executive.component';

describe('AssignToExecutiveComponent', () => {
  let component: AssignToExecutiveComponent;
  let fixture: ComponentFixture<AssignToExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToExecutiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
