import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TesCriticalCommentsComponent } from './tes-critical-comments.component';

describe('TesCriticalCommentsComponent', () => {
  let component: TesCriticalCommentsComponent;
  let fixture: ComponentFixture<TesCriticalCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TesCriticalCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesCriticalCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
