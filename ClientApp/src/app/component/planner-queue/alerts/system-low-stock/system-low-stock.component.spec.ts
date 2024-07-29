import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemLowStockComponent } from './system-low-stock.component';

describe('SystemLowStockComponent', () => {
  let component: SystemLowStockComponent;
  let fixture: ComponentFixture<SystemLowStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemLowStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLowStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
