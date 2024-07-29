import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedRotRepShortageCommentsComponent } from './sched-rot-rep-shortage-comments.component';

describe('SchedRotRepShortageCommentsComponent', () => {
  let component: SchedRotRepShortageCommentsComponent;
  let fixture: ComponentFixture<SchedRotRepShortageCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedRotRepShortageCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedRotRepShortageCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
