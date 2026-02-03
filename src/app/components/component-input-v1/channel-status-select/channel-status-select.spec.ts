import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelStatusSelect } from './channel-status-select';

describe('ChannelStatusSelect', () => {
  let component: ChannelStatusSelect;
  let fixture: ComponentFixture<ChannelStatusSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelStatusSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelStatusSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
