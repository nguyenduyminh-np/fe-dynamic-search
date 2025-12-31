import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionNameInput } from './connection-name-input';

describe('ConnectionNameInput', () => {
  let component: ConnectionNameInput;
  let fixture: ComponentFixture<ConnectionNameInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionNameInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionNameInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
