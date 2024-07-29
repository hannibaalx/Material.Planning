import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssociatedMeNoStockComponent } from './associated-me-no-stock.component';

describe('AssociatedMeNoStockComponent', () => {
  let component: AssociatedMeNoStockComponent;
  let fixture: ComponentFixture<AssociatedMeNoStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedMeNoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedMeNoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
