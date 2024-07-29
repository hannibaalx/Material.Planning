import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtareportsComponent } from './atareports.component';

describe('AtareportsComponent', () => {
  let component: AtareportsComponent;
  let fixture: ComponentFixture<AtareportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtareportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtareportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
