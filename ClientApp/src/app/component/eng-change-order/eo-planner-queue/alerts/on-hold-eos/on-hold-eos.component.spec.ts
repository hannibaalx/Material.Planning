import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnHoldEosComponent } from './on-hold-eos.component';

describe('OnHoldEosComponent', () => {
  let component: OnHoldEosComponent;
  let fixture: ComponentFixture<OnHoldEosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnHoldEosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnHoldEosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
