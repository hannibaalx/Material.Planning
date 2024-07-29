import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMeSetupOrChangesComponent } from './new-me-setup-or-changes.component';

describe('NewMeSetupOrChangesComponent', () => {
  let component: NewMeSetupOrChangesComponent;
  let fixture: ComponentFixture<NewMeSetupOrChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMeSetupOrChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMeSetupOrChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
