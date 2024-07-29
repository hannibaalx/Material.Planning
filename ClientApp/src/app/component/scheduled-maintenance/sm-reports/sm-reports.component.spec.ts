import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmReportsComponent } from './sm-reports.component';

describe('SmReportsComponent', () => {
  let component: SmReportsComponent;
  let fixture: ComponentFixture<SmReportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
