import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AosReviewComponent } from './aos-review.component';

describe('AosReviewComponent', () => {
  let component: AosReviewComponent;
  let fixture: ComponentFixture<AosReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AosReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AosReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
