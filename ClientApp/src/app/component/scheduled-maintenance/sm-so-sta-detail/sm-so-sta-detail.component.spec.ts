import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmSoStaDetailComponent } from './sm-so-sta-detail.component';

describe('SmSoStaDetailComponent', () => {
  let component: SmSoStaDetailComponent;
  let fixture: ComponentFixture<SmSoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
