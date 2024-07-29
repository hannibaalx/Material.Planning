import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPoDetailComponent } from './sm-po-detail.component';

describe('SmPoDetailComponent', () => {
  let component: SmPoDetailComponent;
  let fixture: ComponentFixture<SmPoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
