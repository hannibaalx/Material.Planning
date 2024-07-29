import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMeSetupOrChangesCommentsComponent } from './new-me-setup-or-changes-comments.component';

describe('NewMeSetupOrChangesCommentsComponent', () => {
  let component: NewMeSetupOrChangesCommentsComponent;
  let fixture: ComponentFixture<NewMeSetupOrChangesCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMeSetupOrChangesCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMeSetupOrChangesCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
