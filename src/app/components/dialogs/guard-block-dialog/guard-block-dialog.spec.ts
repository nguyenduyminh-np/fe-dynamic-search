import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardBlockDialog } from './guard-block-dialog';

describe('GuardBlockDialog', () => {
  let component: GuardBlockDialog;
  let fixture: ComponentFixture<GuardBlockDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardBlockDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardBlockDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
