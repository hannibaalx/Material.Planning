import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmDeferralReviewComponent } from './sm-deferral-review.component';

describe('SmDeferralReviewComponent', () => {
  let component: SmDeferralReviewComponent;
  let fixture: ComponentFixture<SmDeferralReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDeferralReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDeferralReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
