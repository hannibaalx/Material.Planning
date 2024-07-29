import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnershipNoAllocationComponent } from './ownership-no-allocation.component';

describe('OwnershipNoAllocationComponent', () => {
  let component: OwnershipNoAllocationComponent;
  let fixture: ComponentFixture<OwnershipNoAllocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipNoAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipNoAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
