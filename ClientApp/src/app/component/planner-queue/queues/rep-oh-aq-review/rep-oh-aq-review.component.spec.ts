import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepOhAqReviewComponent } from './rep-oh-aq-review.component';

describe('RepOhAqReviewComponent', () => {
  let component: RepOhAqReviewComponent;
  let fixture: ComponentFixture<RepOhAqReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepOhAqReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepOhAqReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
