import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBackComponent } from './send-back.component';

describe('SendBackComponent', () => {
  let component: SendBackComponent;
  let fixture: ComponentFixture<SendBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
