import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage180Component } from './part-shortage180.component';

describe('PartShortage180Component', () => {
  let component: PartShortage180Component;
  let fixture: ComponentFixture<PartShortage180Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage180Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage180Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
