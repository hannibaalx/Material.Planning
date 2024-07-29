import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage90Component } from './part-shortage90.component';

describe('PartShortage90Component', () => {
  let component: PartShortage90Component;
  let fixture: ComponentFixture<PartShortage90Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage90Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage90Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
