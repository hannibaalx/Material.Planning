import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainStationBalancingComponent } from './main-station-balancing.component';

describe('MainStationBalancingComponent', () => {
  let component: MainStationBalancingComponent;
  let fixture: ComponentFixture<MainStationBalancingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainStationBalancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStationBalancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
