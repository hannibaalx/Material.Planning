import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoReportComponent } from './eo-report.component';

describe('EoReportComponent', () => {
  let component: EoReportComponent;
  let fixture: ComponentFixture<EoReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
