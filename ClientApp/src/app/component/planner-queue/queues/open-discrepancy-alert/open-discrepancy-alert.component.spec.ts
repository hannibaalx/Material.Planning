import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpenDiscrepancyAlertComponent } from './open-discrepancy-alert.component';

describe('OpenDiscrepancyAlertComponent', () => {
  let component: OpenDiscrepancyAlertComponent;
  let fixture: ComponentFixture<OpenDiscrepancyAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDiscrepancyAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDiscrepancyAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
