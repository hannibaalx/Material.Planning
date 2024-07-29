import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutStationBalancingAlertComponent } from './out-station-balancing-alert.component';

describe('OutStationBalancingAlertComponent', () => {
  let component: OutStationBalancingAlertComponent;
  let fixture: ComponentFixture<OutStationBalancingAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStationBalancingAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStationBalancingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
