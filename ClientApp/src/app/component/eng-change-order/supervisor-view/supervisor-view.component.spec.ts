import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupervisorViewComponent } from './supervisor-view.component';

describe('SupervisorViewComponent', () => {
  let component: SupervisorViewComponent;
  let fixture: ComponentFixture<SupervisorViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
