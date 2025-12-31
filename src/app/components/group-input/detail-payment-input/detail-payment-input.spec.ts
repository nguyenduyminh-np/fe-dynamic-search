import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaymentInput } from './detail-payment-input';

describe('DetailPaymentInput', () => {
  let component: DetailPaymentInput;
  let fixture: ComponentFixture<DetailPaymentInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPaymentInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPaymentInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
