import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoManageNoDash8Component } from './eo-manage-no-dash8.component';

describe('EoManageNoDash8Component', () => {
  let component: EoManageNoDash8Component;
  let fixture: ComponentFixture<EoManageNoDash8Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoManageNoDash8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoManageNoDash8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
