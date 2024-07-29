import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPlannerQueueAlertComponent } from './sm-planner-queue-alert.component';

describe('SmPlannerQueueAlertComponent', () => {
  let component: SmPlannerQueueAlertComponent;
  let fixture: ComponentFixture<SmPlannerQueueAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPlannerQueueAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPlannerQueueAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
