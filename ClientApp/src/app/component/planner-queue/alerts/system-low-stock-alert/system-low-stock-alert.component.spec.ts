import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemLowStockAlertComponent } from './system-low-stock-alert.component';

describe('SystemLowStockAlertComponent', () => {
  let component: SystemLowStockAlertComponent;
  let fixture: ComponentFixture<SystemLowStockAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemLowStockAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLowStockAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
