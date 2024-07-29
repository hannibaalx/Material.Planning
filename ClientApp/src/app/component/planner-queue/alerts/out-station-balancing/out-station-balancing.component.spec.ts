import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutStationBalancingComponent } from './out-station-balancing.component';

describe('OutStationBalancingComponent', () => {
  let component: OutStationBalancingComponent;
  let fixture: ComponentFixture<OutStationBalancingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStationBalancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStationBalancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
