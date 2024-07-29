import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmMeDetailComponent } from './sm-me-detail.component';

describe('SmMeDetailComponent', () => {
  let component: SmMeDetailComponent;
  let fixture: ComponentFixture<SmMeDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmMeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmMeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
