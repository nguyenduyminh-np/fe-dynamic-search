import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCardSwitch } from './mini-card-switch';

describe('MiniCardSwitch', () => {
  let component: MiniCardSwitch;
  let fixture: ComponentFixture<MiniCardSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCardSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCardSwitch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
