import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewOrRepeatedReportsComponent } from '../new-or-repeated-reports/new-or-repeated-reports.component';


describe('NewOrRepeatedReportsComponent', () => {
  let component: NewOrRepeatedReportsComponent;
  let fixture: ComponentFixture<NewOrRepeatedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrRepeatedReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrRepeatedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
