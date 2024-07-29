import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmStationAddedShortageDetailComponent } from './sm-station-added-shortage-detail.component';

describe('SmStationAddedShortageDetailComponent', () => {
  let component: SmStationAddedShortageDetailComponent;
  let fixture: ComponentFixture<SmStationAddedShortageDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmStationAddedShortageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmStationAddedShortageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
