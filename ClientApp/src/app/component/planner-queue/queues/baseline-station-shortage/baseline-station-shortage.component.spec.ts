import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaselineStationShortageComponent } from './baseline-station-shortage.component';

describe('BaselineStationShortageComponent', () => {
  let component: BaselineStationShortageComponent;
  let fixture: ComponentFixture<BaselineStationShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineStationShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineStationShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
