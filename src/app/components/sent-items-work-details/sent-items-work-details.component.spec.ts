import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentItemsWorkDetailsComponent } from './sent-items-work-details.component';

describe('SentItemsWorkDetailsComponent', () => {
  let component: SentItemsWorkDetailsComponent;
  let fixture: ComponentFixture<SentItemsWorkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentItemsWorkDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentItemsWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
