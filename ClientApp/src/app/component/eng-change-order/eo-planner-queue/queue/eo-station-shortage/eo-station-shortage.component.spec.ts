import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoStationShortageComponent } from './eo-station-shortage.component';

describe('EoStationShortageComponent', () => {
  let component: EoStationShortageComponent;
  let fixture: ComponentFixture<EoStationShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoStationShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoStationShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
