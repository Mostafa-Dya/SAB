import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchObservationsComponent } from './search-observations.component';

describe('SearchObservationsComponent', () => {
  let component: SearchObservationsComponent;
  let fixture: ComponentFixture<SearchObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
