import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmreportsComponent } from './smreports.component';

describe('SmreportsComponent', () => {
  let component: SmreportsComponent;
  let fixture: ComponentFixture<SmreportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
