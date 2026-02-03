import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStatusSelect } from './active-status-select';

describe('ActiveStatusSelect', () => {
  let component: ActiveStatusSelect;
  let fixture: ComponentFixture<ActiveStatusSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveStatusSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveStatusSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
