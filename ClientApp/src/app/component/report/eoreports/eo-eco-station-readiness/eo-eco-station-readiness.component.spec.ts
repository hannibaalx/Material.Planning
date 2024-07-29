import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoEcoStationReadinessComponent } from './eo-eco-station-readiness.component';

describe('EcoStationReadinessComponent', () => {
  let component: EoEcoStationReadinessComponent;
  let fixture: ComponentFixture<EoEcoStationReadinessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoEcoStationReadinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoEcoStationReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
