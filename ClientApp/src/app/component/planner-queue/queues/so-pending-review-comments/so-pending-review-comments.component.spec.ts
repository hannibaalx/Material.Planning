import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoPendingReviewCommentsComponent } from './so-pending-review-comments.component';

describe('SoPendingReviewCommentsComponent', () => {
  let component: SoPendingReviewCommentsComponent;
  let fixture: ComponentFixture<SoPendingReviewCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoPendingReviewCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoPendingReviewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
