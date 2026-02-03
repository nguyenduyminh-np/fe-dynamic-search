import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaStatusSelect } from './para-status-select';

describe('ParaStatusSelect', () => {
  let component: ParaStatusSelect;
  let fixture: ComponentFixture<ParaStatusSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParaStatusSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParaStatusSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
