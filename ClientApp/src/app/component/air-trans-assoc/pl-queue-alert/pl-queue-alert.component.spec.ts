import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlQueueAlertComponent } from './pl-queue-alert.component';

describe('PlQueueAlertComponent', () => {
  let component: PlQueueAlertComponent;
  let fixture: ComponentFixture<PlQueueAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlQueueAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlQueueAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
