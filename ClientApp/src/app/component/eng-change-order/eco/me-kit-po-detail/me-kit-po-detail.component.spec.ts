import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeKitPoDetailComponent } from './me-kit-po-detail.component';

describe('MeKitPoDetailComponent', () => {
  let component: MeKitPoDetailComponent;
  let fixture: ComponentFixture<MeKitPoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeKitPoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeKitPoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
