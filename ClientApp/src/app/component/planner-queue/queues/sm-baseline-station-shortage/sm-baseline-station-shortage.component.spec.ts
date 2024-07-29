import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmBaselineStationShortageComponent } from './sm-baseline-station-shortage.component';

describe('SmBaselineStationShortageComponent', () => {
  let component: SmBaselineStationShortageComponent;
  let fixture: ComponentFixture<SmBaselineStationShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmBaselineStationShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmBaselineStationShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
