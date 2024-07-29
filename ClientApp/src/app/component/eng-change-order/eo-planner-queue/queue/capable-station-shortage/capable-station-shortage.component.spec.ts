import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CapableStationShortageComponent } from './capable-station-shortage.component';

describe('CapableStationShortageComponent', () => {
  let component: CapableStationShortageComponent;
  let fixture: ComponentFixture<CapableStationShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CapableStationShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapableStationShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
