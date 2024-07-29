import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeSummaryMePartNumberDetailsComponent } from './me-summary-me-part-number-details.component';

describe('MeSummaryMePartNumberDetailsComponent', () => {
  let component: MeSummaryMePartNumberDetailsComponent;
  let fixture: ComponentFixture<MeSummaryMePartNumberDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeSummaryMePartNumberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeSummaryMePartNumberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
