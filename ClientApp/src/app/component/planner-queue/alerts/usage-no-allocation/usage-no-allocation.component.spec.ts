import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsageNoAllocationComponent } from './usage-no-allocation.component';

describe('UsageNoAllocationComponent', () => {
  let component: UsageNoAllocationComponent;
  let fixture: ComponentFixture<UsageNoAllocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageNoAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageNoAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
