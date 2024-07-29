import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoFullScheduleComponent } from './eo-full-schedule.component';

describe('EoFullScheduleComponent', () => {
  let component: EoFullScheduleComponent;
  let fixture: ComponentFixture<EoFullScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoFullScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoFullScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
