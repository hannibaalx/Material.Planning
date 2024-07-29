import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage6090Component } from './part-shortage6090.component';

describe('PartShortage6090Component', () => {
  let component: PartShortage6090Component;
  let fixture: ComponentFixture<PartShortage6090Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage6090Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage6090Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
