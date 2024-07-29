import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPlannerCommentHistoryComponent } from './sm-planner-comment-history.component';

describe('SmPlannerCommentHistoryComponent', () => {
  let component: SmPlannerCommentHistoryComponent;
  let fixture: ComponentFixture<SmPlannerCommentHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPlannerCommentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPlannerCommentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
