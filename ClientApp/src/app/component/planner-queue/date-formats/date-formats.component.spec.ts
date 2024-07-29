import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateFormatsComponent } from './date-formats.component';

describe('DateFormatsComponent', () => {
  let component: DateFormatsComponent;
  let fixture: ComponentFixture<DateFormatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateFormatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
