import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoRepairOrderComponent } from './eo-repair-order.component';

describe('RepairOrderComponent', () => {
  let component: EoRepairOrderComponent;
  let fixture: ComponentFixture<EoRepairOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoRepairOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoRepairOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
