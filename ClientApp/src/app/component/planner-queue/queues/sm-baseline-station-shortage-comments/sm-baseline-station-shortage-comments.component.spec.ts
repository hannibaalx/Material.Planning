import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmBaselineStationShortageCommentsComponent } from './sm-baseline-station-shortage-comments.component';

describe('SmBaselineStationShortageCommentsComponent', () => {
  let component: SmBaselineStationShortageCommentsComponent;
  let fixture: ComponentFixture<SmBaselineStationShortageCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmBaselineStationShortageCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmBaselineStationShortageCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
