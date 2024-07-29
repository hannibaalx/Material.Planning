import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage30Component } from './part-shortage30.component';

describe('PartShortage30Component', () => {
  let component: PartShortage30Component;
  let fixture: ComponentFixture<PartShortage30Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage30Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage30Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
