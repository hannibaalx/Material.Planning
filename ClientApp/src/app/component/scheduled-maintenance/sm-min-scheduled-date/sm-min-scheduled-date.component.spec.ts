import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmMinScheduledDateComponent } from './sm-min-scheduled-date.component';

describe('SmMinScheduledDateComponent', () => {
  let component: SmMinScheduledDateComponent;
  let fixture: ComponentFixture<SmMinScheduledDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmMinScheduledDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmMinScheduledDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
