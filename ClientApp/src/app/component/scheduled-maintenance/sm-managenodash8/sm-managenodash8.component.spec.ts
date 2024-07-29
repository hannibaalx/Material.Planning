import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmManagenodash8Component } from './sm-managenodash8.component';

describe('SmManagenodash8Component', () => {
  let component: SmManagenodash8Component;
  let fixture: ComponentFixture<SmManagenodash8Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmManagenodash8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmManagenodash8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
