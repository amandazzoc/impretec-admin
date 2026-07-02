import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyBanner } from './read-only-banner';

describe('ReadOnlyBanner', () => {
  let component: ReadOnlyBanner;
  let fixture: ComponentFixture<ReadOnlyBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadOnlyBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadOnlyBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
