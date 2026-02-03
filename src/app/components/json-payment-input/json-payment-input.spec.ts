import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPaymentInput } from './json-payment-input';

describe('JsonPaymentInput', () => {
  let component: JsonPaymentInput;
  let fixture: ComponentFixture<JsonPaymentInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonPaymentInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonPaymentInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
