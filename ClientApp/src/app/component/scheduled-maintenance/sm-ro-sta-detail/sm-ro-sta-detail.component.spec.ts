import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmRoStaDetailComponent } from './sm-ro-sta-detail.component';

describe('SmRoStaDetailComponent', () => {
  let component: SmRoStaDetailComponent;
  let fixture: ComponentFixture<SmRoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
