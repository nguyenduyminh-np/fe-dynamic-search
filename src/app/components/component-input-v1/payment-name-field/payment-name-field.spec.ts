import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentNameField } from './payment-name-field';

describe('PaymentNameField', () => {
  let component: PaymentNameField;
  let fixture: ComponentFixture<PaymentNameField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentNameField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentNameField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
