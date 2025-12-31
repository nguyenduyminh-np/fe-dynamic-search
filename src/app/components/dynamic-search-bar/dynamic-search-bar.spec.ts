import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSearchBar } from './dynamic-search-bar';

describe('DynamicSearchBar', () => {
  let component: DynamicSearchBar;
  let fixture: ComponentFixture<DynamicSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicSearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
