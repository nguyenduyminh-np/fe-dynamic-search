import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelEdit } from './payment-channel-edit';

describe('PaymentChannelEdit', () => {
  let component: PaymentChannelEdit;
  let fixture: ComponentFixture<PaymentChannelEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChannelEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
