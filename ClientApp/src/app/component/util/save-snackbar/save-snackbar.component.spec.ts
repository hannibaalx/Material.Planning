import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveSnackbarComponent } from './save-snackbar.component';

describe('SaveSnackbarComponent', () => {
  let component: SaveSnackbarComponent;
  let fixture: ComponentFixture<SaveSnackbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
