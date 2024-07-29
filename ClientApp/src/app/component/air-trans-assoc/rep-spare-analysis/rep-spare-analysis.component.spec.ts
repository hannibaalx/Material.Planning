import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepSpareAnalysisComponent } from './rep-spare-analysis.component';

describe('RepSpareAnalysisComponent', () => {
  let component: RepSpareAnalysisComponent;
  let fixture: ComponentFixture<RepSpareAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepSpareAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepSpareAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
