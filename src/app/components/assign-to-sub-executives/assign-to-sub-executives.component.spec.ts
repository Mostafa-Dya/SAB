import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToSubExecutivesComponent } from './assign-to-sub-executives.component';

describe('AssignToSubExecutivesComponent', () => {
  let component: AssignToSubExecutivesComponent;
  let fixture: ComponentFixture<AssignToSubExecutivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToSubExecutivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToSubExecutivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
