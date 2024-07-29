import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZeroStockCommentsComponent } from './zero-stock-comments.component';

describe('ZeroStockCommentsComponent', () => {
  let component: ZeroStockCommentsComponent;
  let fixture: ComponentFixture<ZeroStockCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroStockCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStockCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
