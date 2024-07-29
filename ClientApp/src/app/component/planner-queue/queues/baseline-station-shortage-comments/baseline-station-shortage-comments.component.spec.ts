import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaselineStationShortageCommentsComponent } from './baseline-station-shortage-comments.component';

describe('BaselineStationShortageCommentsComponent', () => {
  let component: BaselineStationShortageCommentsComponent;
  let fixture: ComponentFixture<BaselineStationShortageCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineStationShortageCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineStationShortageCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
