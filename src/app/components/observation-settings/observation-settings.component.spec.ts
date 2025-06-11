import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationSettingsComponent } from './observation-settings.component';

describe('ObservationSettingsComponent', () => {
  let component: ObservationSettingsComponent;
  let fixture: ComponentFixture<ObservationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
