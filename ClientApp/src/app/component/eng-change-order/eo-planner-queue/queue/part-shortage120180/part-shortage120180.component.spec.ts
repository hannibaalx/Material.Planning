import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage120180Component } from './part-shortage120180.component';

describe('PartShortage120180Component', () => {
  let component: PartShortage120180Component;
  let fixture: ComponentFixture<PartShortage120180Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage120180Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage120180Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
