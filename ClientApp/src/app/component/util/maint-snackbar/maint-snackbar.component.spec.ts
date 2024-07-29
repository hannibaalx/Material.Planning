import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaintSnackbarComponent } from './maint-snackbar.component';

describe('MaintSnackbarComponent', () => {
  let component: MaintSnackbarComponent;
  let fixture: ComponentFixture<MaintSnackbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
