import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeRoDetailComponent } from './me-ro-detail.component';

describe('MeRoDetailComponent', () => {
  let component: MeRoDetailComponent;
  let fixture: ComponentFixture<MeRoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeRoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeRoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
