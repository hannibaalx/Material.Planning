import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgingPoRoComponent } from './aging-po-ro.component';

describe('AgingPoRoComponent', () => {
  let component: AgingPoRoComponent;
  let fixture: ComponentFixture<AgingPoRoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingPoRoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingPoRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
