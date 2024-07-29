import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZeroStockComponent } from './zero-stock.component';

describe('ZeroStockComponent', () => {
  let component: ZeroStockComponent;
  let fixture: ComponentFixture<ZeroStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
