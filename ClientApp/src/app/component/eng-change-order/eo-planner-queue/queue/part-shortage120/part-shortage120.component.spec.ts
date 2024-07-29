import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage120Component } from './part-shortage120.component';

describe('PartShortage120Component', () => {
  let component: PartShortage120Component;
  let fixture: ComponentFixture<PartShortage120Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage120Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage120Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
