import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AosReviewAlertComponent } from './aos-review-alert.component';

describe('AosReviewAlertComponent', () => {
  let component: AosReviewAlertComponent;
  let fixture: ComponentFixture<AosReviewAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AosReviewAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AosReviewAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
