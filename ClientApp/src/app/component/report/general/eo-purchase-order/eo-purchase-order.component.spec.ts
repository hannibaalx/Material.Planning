import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoPurchaseOrderComponent } from './eo-purchase-order.component';

describe('EoPurchaseOrderComponent', () => {
  let component: EoPurchaseOrderComponent;
  let fixture: ComponentFixture<EoPurchaseOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
