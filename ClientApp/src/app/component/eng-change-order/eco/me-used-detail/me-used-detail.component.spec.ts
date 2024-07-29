import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeUsedDetailComponent } from './me-used-detail.component';

describe('MeUsedDetailComponent', () => {
  let component: MeUsedDetailComponent;
  let fixture: ComponentFixture<MeUsedDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeUsedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeUsedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
