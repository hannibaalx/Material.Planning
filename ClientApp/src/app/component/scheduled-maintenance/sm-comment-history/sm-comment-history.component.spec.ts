import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmCommentHistoryComponent } from './sm-comment-history.component';

describe('SmCommentHistoryComponent', () => {
  let component: SmCommentHistoryComponent;
  let fixture: ComponentFixture<SmCommentHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmCommentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmCommentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
