import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepOhAqReviewCommentsComponent } from './rep-oh-aq-review-comments.component';

describe('RepOhAqReviewCommentsComponent', () => {
  let component: RepOhAqReviewCommentsComponent;
  let fixture: ComponentFixture<RepOhAqReviewCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepOhAqReviewCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepOhAqReviewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
