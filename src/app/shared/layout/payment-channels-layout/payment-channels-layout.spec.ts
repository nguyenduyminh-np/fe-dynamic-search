import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelsLayout } from './payment-channels-layout';

describe('PaymentChannelsLayout', () => {
  let component: PaymentChannelsLayout;
  let fixture: ComponentFixture<PaymentChannelsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChannelsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelsLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
