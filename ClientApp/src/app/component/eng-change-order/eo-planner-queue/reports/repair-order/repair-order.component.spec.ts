import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepairOrderComponent } from './repair-order.component';

describe('RepairOrderComponent', () => {
  let component: RepairOrderComponent;
  let fixture: ComponentFixture<RepairOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
