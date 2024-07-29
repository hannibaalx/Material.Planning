import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmDash8CommentDetailsComponent } from './sm-dash8-comment-details.component';

describe('SmDash8CommentDetailsComponent', () => {
  let component: SmDash8CommentDetailsComponent;
  let fixture: ComponentFixture<SmDash8CommentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDash8CommentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDash8CommentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
