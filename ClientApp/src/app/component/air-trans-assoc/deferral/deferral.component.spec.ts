import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeferralComponent } from './deferral.component';

describe('DeferralComponent', () => {
  let component: DeferralComponent;
  let fixture: ComponentFixture<DeferralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
