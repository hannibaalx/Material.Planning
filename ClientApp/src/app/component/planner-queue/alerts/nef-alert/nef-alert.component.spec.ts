import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NefAlertComponent } from './nef-alert.component';

describe('NefAlertComponent', () => {
  let component: NefAlertComponent;
  let fixture: ComponentFixture<NefAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NefAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NefAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
