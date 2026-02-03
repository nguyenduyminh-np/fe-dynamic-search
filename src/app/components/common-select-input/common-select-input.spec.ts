import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSelectInput } from './common-select-input';

describe('CommonSelectInput', () => {
  let component: CommonSelectInput;
  let fixture: ComponentFixture<CommonSelectInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSelectInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSelectInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
