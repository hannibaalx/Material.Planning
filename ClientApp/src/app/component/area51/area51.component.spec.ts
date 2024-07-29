import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Area51Component } from './area51.component';

describe('Area51Component', () => {
  let component: Area51Component;
  let fixture: ComponentFixture<Area51Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Area51Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Area51Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
