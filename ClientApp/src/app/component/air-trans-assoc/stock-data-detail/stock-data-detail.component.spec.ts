import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockDataDetailComponent } from './stock-data-detail.component';

describe('StockDataDetailComponent', () => {
  let component: StockDataDetailComponent;
  let fixture: ComponentFixture<StockDataDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDataDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
