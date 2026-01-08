import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesNotFoundPage } from './resources-not-found-page';

describe('ResourcesNotFoundPage', () => {
  let component: ResourcesNotFoundPage;
  let fixture: ComponentFixture<ResourcesNotFoundPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesNotFoundPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesNotFoundPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
