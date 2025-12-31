import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaPaymentCreate } from './payment-channel-create.';

describe('ParaPaymentCreate', () => {
  let component: ParaPaymentCreate;
  let fixture: ComponentFixture<ParaPaymentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParaPaymentCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ParaPaymentCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
