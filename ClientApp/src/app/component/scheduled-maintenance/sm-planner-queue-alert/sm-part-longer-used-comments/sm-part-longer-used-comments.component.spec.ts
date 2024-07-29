import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPartLongerUsedCommentsComponent } from './sm-part-longer-used-comments.component';

describe('SmPartLongerUsedCommentsComponent', () => {
  let component: SmPartLongerUsedCommentsComponent;
  let fixture: ComponentFixture<SmPartLongerUsedCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPartLongerUsedCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPartLongerUsedCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
