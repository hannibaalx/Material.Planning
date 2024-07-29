import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssociatedMeNoStockCommentComponent } from './associated-me-no-stock-comment.component';

describe('AssociatedMeNoStockCommentComponent', () => {
  let component: AssociatedMeNoStockCommentComponent;
  let fixture: ComponentFixture<AssociatedMeNoStockCommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedMeNoStockCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedMeNoStockCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
