import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmDeferralReviewCommentsComponent } from './sm-deferral-review-comments.component';

describe('SmDeferralReviewCommentsComponent', () => {
  let component: SmDeferralReviewCommentsComponent;
  let fixture: ComponentFixture<SmDeferralReviewCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDeferralReviewCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDeferralReviewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
