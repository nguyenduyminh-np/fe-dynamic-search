import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPaymentInput } from './general-payment-input';

describe('GeneralPaymentInput', () => {
  let component: GeneralPaymentInput;
  let fixture: ComponentFixture<GeneralPaymentInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralPaymentInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralPaymentInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
