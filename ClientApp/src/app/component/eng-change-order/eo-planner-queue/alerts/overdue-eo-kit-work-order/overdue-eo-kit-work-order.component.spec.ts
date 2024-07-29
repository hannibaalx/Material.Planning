import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverdueEoKitWorkOrderComponent } from './overdue-eo-kit-work-order.component';

describe('OverdueEoKitWorkOrderComponent', () => {
  let component: OverdueEoKitWorkOrderComponent;
  let fixture: ComponentFixture<OverdueEoKitWorkOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueEoKitWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueEoKitWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
