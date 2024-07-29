import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmNewStationsChangesCommentsComponent } from './sm-new-stations-changes-comments.component';

describe('SmNewStationsChangesCommentsComponent', () => {
  let component: SmNewStationsChangesCommentsComponent;
  let fixture: ComponentFixture<SmNewStationsChangesCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmNewStationsChangesCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNewStationsChangesCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
