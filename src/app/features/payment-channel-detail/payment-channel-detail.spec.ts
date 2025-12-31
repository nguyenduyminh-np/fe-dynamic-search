import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelDetail } from './payment-channel-detail';

describe('PaymentChannelDetail', () => {
  let component: PaymentChannelDetail;
  let fixture: ComponentFixture<PaymentChannelDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChannelDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
