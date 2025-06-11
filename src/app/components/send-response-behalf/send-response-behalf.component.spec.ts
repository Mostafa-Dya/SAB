import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendResponseBehalfComponent } from './send-response-behalf.component';

describe('SendResponseBehalfComponent', () => {
  let component: SendResponseBehalfComponent;
  let fixture: ComponentFixture<SendResponseBehalfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendResponseBehalfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendResponseBehalfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
