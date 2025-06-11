import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseProgressWorkDetailsComponent } from './response-progress-work-details.component';

describe('ResponseProgressWorkDetailsComponent', () => {
  let component: ResponseProgressWorkDetailsComponent;
  let fixture: ComponentFixture<ResponseProgressWorkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseProgressWorkDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseProgressWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
