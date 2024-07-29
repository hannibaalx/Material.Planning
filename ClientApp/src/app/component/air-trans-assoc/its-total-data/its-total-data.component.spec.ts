import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItsTotalDataComponent } from './its-total-data.component';

describe('ItsTotalDataComponent', () => {
  let component: ItsTotalDataComponent;
  let fixture: ComponentFixture<ItsTotalDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItsTotalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItsTotalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
