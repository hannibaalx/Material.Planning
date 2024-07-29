import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgingPoRoAlertComponent } from './aging-po-ro-alert.component';

describe('AgingPoRoAlertComponent', () => {
  let component: AgingPoRoAlertComponent;
  let fixture: ComponentFixture<AgingPoRoAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingPoRoAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingPoRoAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
