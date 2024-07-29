import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlannerQueueComponent } from './planner-queue.component';

describe('PlannerQueueComponent', () => {
  let component: PlannerQueueComponent;
  let fixture: ComponentFixture<PlannerQueueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
