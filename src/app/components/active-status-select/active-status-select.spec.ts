import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiceStatusSelect } from './active-status-select';

describe('ActiceStatusSelect', () => {
  let component: ActiceStatusSelect;
  let fixture: ComponentFixture<ActiceStatusSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiceStatusSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiceStatusSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
