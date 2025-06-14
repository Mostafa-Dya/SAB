import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDelegationDialogComponent } from './edit-delegation-dialog.component';

describe('EditDelegationDialogComponent', () => {
  let component: EditDelegationDialogComponent;
  let fixture: ComponentFixture<EditDelegationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDelegationDialogComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDelegationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
