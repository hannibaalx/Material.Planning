import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeKitRoDetailComponent } from './me-kit-ro-detail.component';

describe('MeKitRoDetailComponent', () => {
  let component: MeKitRoDetailComponent;
  let fixture: ComponentFixture<MeKitRoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeKitRoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeKitRoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
