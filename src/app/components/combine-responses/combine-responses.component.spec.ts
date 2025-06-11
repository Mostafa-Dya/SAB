import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineResponsesComponent } from './combine-responses.component';

describe('CombineResponsesComponent', () => {
  let component: CombineResponsesComponent;
  let fixture: ComponentFixture<CombineResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombineResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
