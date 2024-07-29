import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoDash8DetailComponent } from './eo-dash8-detail.component';

describe('EoDash8DetailComponent', () => {
  let component: EoDash8DetailComponent;
  let fixture: ComponentFixture<EoDash8DetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoDash8DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoDash8DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
