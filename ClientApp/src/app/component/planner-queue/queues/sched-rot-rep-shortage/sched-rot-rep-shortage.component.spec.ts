import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedRotRepShortageComponent } from './sched-rot-rep-shortage.component';

describe('SchedRotRepShortageComponent', () => {
  let component: SchedRotRepShortageComponent;
  let fixture: ComponentFixture<SchedRotRepShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedRotRepShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedRotRepShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
