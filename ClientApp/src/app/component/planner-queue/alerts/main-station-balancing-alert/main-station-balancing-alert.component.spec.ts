import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainStationBalancingAlertComponent } from './main-station-balancing-alert.component';

describe('MainStationBalancingAlertComponent', () => {
  let component: MainStationBalancingAlertComponent;
  let fixture: ComponentFixture<MainStationBalancingAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainStationBalancingAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStationBalancingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
