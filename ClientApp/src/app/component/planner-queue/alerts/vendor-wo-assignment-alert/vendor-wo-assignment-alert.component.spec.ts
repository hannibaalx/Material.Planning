import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorWoAssignmentAlertComponent } from './vendor-wo-assignment-alert.component';

describe('VendorWoAssignmentAlertComponent', () => {
  let component: VendorWoAssignmentAlertComponent;
  let fixture: ComponentFixture<VendorWoAssignmentAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorWoAssignmentAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWoAssignmentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
