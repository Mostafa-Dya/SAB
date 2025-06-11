import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResponseAdminComponent } from './update-response-admin.component';

describe('UpdateResponseAdminComponent', () => {
  let component: UpdateResponseAdminComponent;
  let fixture: ComponentFixture<UpdateResponseAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateResponseAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateResponseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
