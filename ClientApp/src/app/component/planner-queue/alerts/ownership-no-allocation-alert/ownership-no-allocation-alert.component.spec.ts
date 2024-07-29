import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnershipNoAllocationAlertComponent } from './ownership-no-allocation-alert.component';

describe('OwnershipNoAllocationAlertComponent', () => {
  let component: OwnershipNoAllocationAlertComponent;
  let fixture: ComponentFixture<OwnershipNoAllocationAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipNoAllocationAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipNoAllocationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
