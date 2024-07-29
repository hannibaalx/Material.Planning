import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmScheduledRotableBomComponent } from './sm-scheduled-rotable-bom.component';

describe('SmScheduledRotableBomComponent', () => {
  let component: SmScheduledRotableBomComponent;
  let fixture: ComponentFixture<SmScheduledRotableBomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmScheduledRotableBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmScheduledRotableBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
