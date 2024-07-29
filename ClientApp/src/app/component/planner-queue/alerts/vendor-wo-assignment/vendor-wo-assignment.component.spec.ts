import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorWoAssignmentComponent } from './vendor-wo-assignment.component';

describe('VendorWoAssignmentComponent', () => {
  let component: VendorWoAssignmentComponent;
  let fixture: ComponentFixture<VendorWoAssignmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorWoAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWoAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
