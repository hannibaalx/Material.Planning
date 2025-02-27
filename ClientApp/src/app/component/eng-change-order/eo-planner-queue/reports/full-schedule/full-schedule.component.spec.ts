import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullScheduleComponent } from './full-schedule.component';

describe('FullScheduleComponent', () => {
  let component: FullScheduleComponent;
  let fixture: ComponentFixture<FullScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
