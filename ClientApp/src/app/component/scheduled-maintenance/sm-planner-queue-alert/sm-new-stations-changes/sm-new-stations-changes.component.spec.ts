import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmNewStationsChangesComponent } from './sm-new-stations-changes.component';

describe('SmNewStationsChangesComponent', () => {
  let component: SmNewStationsChangesComponent;
  let fixture: ComponentFixture<SmNewStationsChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmNewStationsChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNewStationsChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
