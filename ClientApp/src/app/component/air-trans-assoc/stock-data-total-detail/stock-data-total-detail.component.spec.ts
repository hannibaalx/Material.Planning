import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockDataTotalDetailComponent } from './stock-data-total-detail.component';

describe('StockDataTotalDetailComponent', () => {
  let component: StockDataTotalDetailComponent;
  let fixture: ComponentFixture<StockDataTotalDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDataTotalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDataTotalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
