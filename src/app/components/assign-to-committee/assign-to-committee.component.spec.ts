import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToCommitteeComponent } from './assign-to-committee.component';

describe('AssignToCommitteeComponent', () => {
  let component: AssignToCommitteeComponent;
  let fixture: ComponentFixture<AssignToCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
