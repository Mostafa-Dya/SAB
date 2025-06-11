import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationSettingsComponent } from './escalation-settings.component';

describe('EscalationSettingsComponent', () => {
  let component: EscalationSettingsComponent;
  let fixture: ComponentFixture<EscalationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
