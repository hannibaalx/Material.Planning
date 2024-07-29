import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoPlannerQueueComponent } from './eo-planner-queue.component';

describe('EoPlannerQueueComponent', () => {
  let component: EoPlannerQueueComponent;
  let fixture: ComponentFixture<EoPlannerQueueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoPlannerQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPlannerQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
