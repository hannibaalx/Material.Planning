import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPartNoLongerUsedComponent } from './sm-part-no-longer-used.component';

describe('SmPartNoLongerUsedComponent', () => {
  let component: SmPartNoLongerUsedComponent;
  let fixture: ComponentFixture<SmPartNoLongerUsedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPartNoLongerUsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPartNoLongerUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
