import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeRoStaDetailComponent } from './me-ro-sta-detail.component';

describe('MeRoStaDetailComponent', () => {
  let component: MeRoStaDetailComponent;
  let fixture: ComponentFixture<MeRoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeRoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeRoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
