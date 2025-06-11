import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineSendBackComponent } from './decline-send-back.component';

describe('DeclineSendBackComponent', () => {
  let component: DeclineSendBackComponent;
  let fixture: ComponentFixture<DeclineSendBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclineSendBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineSendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
