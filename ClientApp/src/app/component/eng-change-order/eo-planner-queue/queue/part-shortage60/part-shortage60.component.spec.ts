import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage60Component } from './part-shortage60.component';

describe('PartShortage60Component', () => {
  let component: PartShortage60Component;
  let fixture: ComponentFixture<PartShortage60Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage60Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
