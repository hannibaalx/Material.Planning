import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RotSpareAnalysisComponent } from './rot-spare-analysis.component';

describe('RotSpareAnalysisComponent', () => {
  let component: RotSpareAnalysisComponent;
  let fixture: ComponentFixture<RotSpareAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RotSpareAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotSpareAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
