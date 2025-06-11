import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDocumentComponent } from './email-document.component';

describe('EmailDocumentComponent', () => {
  let component: EmailDocumentComponent;
  let fixture: ComponentFixture<EmailDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
