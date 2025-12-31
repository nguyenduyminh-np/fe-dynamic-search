import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyCodeSelect } from './currency-code-select';

describe('CurrencyCodeSelect', () => {
  let component: CurrencyCodeSelect;
  let fixture: ComponentFixture<CurrencyCodeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyCodeSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyCodeSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
