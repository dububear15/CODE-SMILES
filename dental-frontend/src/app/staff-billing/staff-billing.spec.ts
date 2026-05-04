import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffBilling } from './staff-billing';

describe('StaffBilling', () => {
  let component: StaffBilling;
  let fixture: ComponentFixture<StaffBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffBilling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
