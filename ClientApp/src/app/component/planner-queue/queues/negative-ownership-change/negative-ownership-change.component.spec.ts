import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NegativeOwnershipChangeComponent } from './negative-ownership-change.component';

describe('NegativeOwnershipChangeComponent', () => {
  let component: NegativeOwnershipChangeComponent;
  let fixture: ComponentFixture<NegativeOwnershipChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeOwnershipChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeOwnershipChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
