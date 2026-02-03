import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailDialog } from './payment-detail-dialog';

describe('PaymentDetailDialog', () => {
  let component: PaymentDetailDialog;
  let fixture: ComponentFixture<PaymentDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
