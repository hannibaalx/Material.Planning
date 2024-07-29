import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YesterdayDeferralsComponent } from './yesterday-deferrals.component';

describe('YesterdayDeferralsComponent', () => {
  let component: YesterdayDeferralsComponent;
  let fixture: ComponentFixture<YesterdayDeferralsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YesterdayDeferralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesterdayDeferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
