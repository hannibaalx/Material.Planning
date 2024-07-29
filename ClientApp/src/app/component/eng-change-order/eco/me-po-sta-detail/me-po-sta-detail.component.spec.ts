import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MePoStaDetailComponent } from './me-po-sta-detail.component';

describe('MePoStaDetailComponent', () => {
  let component: MePoStaDetailComponent;
  let fixture: ComponentFixture<MePoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MePoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MePoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
