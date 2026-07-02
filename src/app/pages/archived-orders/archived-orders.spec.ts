import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedOrders } from './archived-orders';

describe('ArchivedOrders', () => {
  let component: ArchivedOrders;
  let fixture: ComponentFixture<ArchivedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
