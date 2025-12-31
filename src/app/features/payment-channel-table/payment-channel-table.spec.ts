import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelTable } from './payment-channel-table';

describe('PaymentChannelTable', () => {
  let component: PaymentChannelTable;
  let fixture: ComponentFixture<PaymentChannelTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChannelTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentChannelTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
