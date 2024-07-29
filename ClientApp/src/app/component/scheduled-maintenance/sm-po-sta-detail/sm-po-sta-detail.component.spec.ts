import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmPoStaDetailComponent } from './sm-po-sta-detail.component';

describe('SmPoStaDetailComponent', () => {
  let component: SmPoStaDetailComponent;
  let fixture: ComponentFixture<SmPoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmPoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmPoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
