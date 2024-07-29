import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpareAnalysisCommentHistoryComponent } from './spare-analysis-comment-history.component';

describe('SpareAnalysisCommentHistoryComponent', () => {
  let component: SpareAnalysisCommentHistoryComponent;
  let fixture: ComponentFixture<SpareAnalysisCommentHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareAnalysisCommentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareAnalysisCommentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
