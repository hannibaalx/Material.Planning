import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SparesAnalysisComponent } from './spares-analysis.component';

describe('SpareAnalysisComponent', () => {
  let component: SparesAnalysisComponent;
  let fixture: ComponentFixture<SparesAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SparesAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
