import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JifReportComponent } from './jif-report.component';

describe('JifReportComponent', () => {
  let component: JifReportComponent;
  let fixture: ComponentFixture<JifReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JifReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JifReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
