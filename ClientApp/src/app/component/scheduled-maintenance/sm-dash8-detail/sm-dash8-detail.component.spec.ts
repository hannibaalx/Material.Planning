import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmDash8DetailComponent } from './sm-dash8-detail.component';

describe('SmDash8DetailComponent', () => {
  let component: SmDash8DetailComponent;
  let fixture: ComponentFixture<SmDash8DetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDash8DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDash8DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
