import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherResponsesComponent } from './other-responses.component';

describe('OtherResponsesComponent', () => {
  let component: OtherResponsesComponent;
  let fixture: ComponentFixture<OtherResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
