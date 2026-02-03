import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStandardSelect } from './message-standard-select';

describe('MessageStandardSelect', () => {
  let component: MessageStandardSelect;
  let fixture: ComponentFixture<MessageStandardSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageStandardSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageStandardSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
