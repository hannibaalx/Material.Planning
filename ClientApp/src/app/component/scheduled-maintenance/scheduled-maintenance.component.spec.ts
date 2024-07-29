import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

describe('ScheduledMaintenanceComponent', () => {
  let component: ScheduledMaintenanceComponent;
  let fixture: ComponentFixture<ScheduledMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
