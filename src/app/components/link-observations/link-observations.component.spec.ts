import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkObservationsComponent } from './link-observations.component';

describe('LinkObservationsComponent', () => {
  let component: LinkObservationsComponent;
  let fixture: ComponentFixture<LinkObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
