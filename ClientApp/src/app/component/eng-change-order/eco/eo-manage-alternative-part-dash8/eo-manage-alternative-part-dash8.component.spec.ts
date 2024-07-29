import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoManageAlternativePartDash8Component } from './eo-manage-alternative-part-dash8.component';

describe('EoManageAlternativePartDash8Component', () => {
  let component: EoManageAlternativePartDash8Component;
  let fixture: ComponentFixture<EoManageAlternativePartDash8Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoManageAlternativePartDash8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoManageAlternativePartDash8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
