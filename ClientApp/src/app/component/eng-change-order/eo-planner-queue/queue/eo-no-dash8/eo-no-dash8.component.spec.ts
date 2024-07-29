import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoNoDash8Component } from './eo-no-dash8.component';

describe('EoNoDash8Component', () => {
  let component: EoNoDash8Component;
  let fixture: ComponentFixture<EoNoDash8Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoNoDash8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoNoDash8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
