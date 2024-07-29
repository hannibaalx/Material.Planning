import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmScheduledRotableBomCommentsComponent } from './sm-scheduled-rotable-bom-comments.component';

describe('SmScheduledRotableBomCommentsComponent', () => {
  let component: SmScheduledRotableBomCommentsComponent;
  let fixture: ComponentFixture<SmScheduledRotableBomCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmScheduledRotableBomCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmScheduledRotableBomCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
