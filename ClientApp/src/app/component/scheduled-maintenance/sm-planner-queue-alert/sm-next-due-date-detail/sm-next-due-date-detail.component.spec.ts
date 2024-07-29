import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmNextDueDateDetailComponent } from './sm-next-due-date-detail.component';

describe('SmNextDueDateDetailComponent', () => {
  let component: SmNextDueDateDetailComponent;
  let fixture: ComponentFixture<SmNextDueDateDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmNextDueDateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmNextDueDateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
