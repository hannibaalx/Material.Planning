import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EcoQueueAlertBottomSheetComponent } from './eco-queue-alert-bottom-sheet.component';

describe('EcoQueueAlertBottomSheetComponent', () => {
  let component: EcoQueueAlertBottomSheetComponent;
  let fixture: ComponentFixture<EcoQueueAlertBottomSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoQueueAlertBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoQueueAlertBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
