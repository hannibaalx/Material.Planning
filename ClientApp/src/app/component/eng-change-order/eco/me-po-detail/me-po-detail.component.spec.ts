import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MePoDetailComponent } from './me-po-detail.component';

describe('MePoDetailComponent', () => {
  let component: MePoDetailComponent;
  let fixture: ComponentFixture<MePoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MePoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MePoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
