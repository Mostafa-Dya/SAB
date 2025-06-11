import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSendBackComponent } from './cancel-send-back.component';

describe('CancelSendBackComponent', () => {
  let component: CancelSendBackComponent;
  let fixture: ComponentFixture<CancelSendBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSendBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
