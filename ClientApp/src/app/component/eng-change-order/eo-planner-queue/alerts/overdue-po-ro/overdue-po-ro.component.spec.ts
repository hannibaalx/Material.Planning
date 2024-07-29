import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverduePoRoComponent } from './overdue-po-ro.component';

describe('OverduePoRoComponent', () => {
  let component: OverduePoRoComponent;
  let fixture: ComponentFixture<OverduePoRoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverduePoRoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverduePoRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
