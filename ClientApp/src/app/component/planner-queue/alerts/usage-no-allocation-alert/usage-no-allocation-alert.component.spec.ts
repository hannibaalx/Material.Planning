import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsageNoAllocationAlertComponent } from './usage-no-allocation-alert.component';

describe('UsageNoAllocationAlertComponent', () => {
  let component: UsageNoAllocationAlertComponent;
  let fixture: ComponentFixture<UsageNoAllocationAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageNoAllocationAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageNoAllocationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
