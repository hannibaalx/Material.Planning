import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoPoDiscrepancyComponent } from './eo-po-discrepancy.component';

describe('EoPoDiscrepancyComponent', () => {
  let component: EoPoDiscrepancyComponent;
  let fixture: ComponentFixture<EoPoDiscrepancyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoPoDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPoDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
