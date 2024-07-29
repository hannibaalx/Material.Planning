import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NegativeOwnershipChangeCommentsComponent } from './negative-ownership-change-comments.component';

describe('NegativeOwnershipChangeCommentsComponent', () => {
  let component: NegativeOwnershipChangeCommentsComponent;
  let fixture: ComponentFixture<NegativeOwnershipChangeCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeOwnershipChangeCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeOwnershipChangeCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
