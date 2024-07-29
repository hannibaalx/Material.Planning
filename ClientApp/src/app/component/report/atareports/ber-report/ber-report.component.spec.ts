import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BerReportComponent } from './ber-report.component';

describe('BerReportComponent', () => {
  let component: BerReportComponent;
  let fixture: ComponentFixture<BerReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
