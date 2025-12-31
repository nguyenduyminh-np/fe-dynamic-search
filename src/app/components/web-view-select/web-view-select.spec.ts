import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebViewSelect } from './web-view-select';

describe('WebViewSelect', () => {
  let component: WebViewSelect;
  let fixture: ComponentFixture<WebViewSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebViewSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebViewSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
