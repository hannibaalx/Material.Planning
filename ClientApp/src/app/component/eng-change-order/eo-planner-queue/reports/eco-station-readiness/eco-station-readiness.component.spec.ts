import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EcoStationReadinessComponent } from './eco-station-readiness.component';

describe('EcoStationReadinessComponent', () => {
  let component: EcoStationReadinessComponent;
  let fixture: ComponentFixture<EcoStationReadinessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoStationReadinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoStationReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
