import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseProgressComponent } from './response-progress.component';

describe('ResponseProgressComponent', () => {
  let component: ResponseProgressComponent;
  let fixture: ComponentFixture<ResponseProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
