import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeSplitMeDetailComponent } from './me-split-me-detail.component';

describe('MeSplitMeDetailComponent', () => {
  let component: MeSplitMeDetailComponent;
  let fixture: ComponentFixture<MeSplitMeDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeSplitMeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeSplitMeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
