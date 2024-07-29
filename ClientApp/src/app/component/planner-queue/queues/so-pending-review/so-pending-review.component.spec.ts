import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoPendingReviewComponent } from './so-pending-review.component';

describe('SoPendingReviewComponent', () => {
  let component: SoPendingReviewComponent;
  let fixture: ComponentFixture<SoPendingReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoPendingReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoPendingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
