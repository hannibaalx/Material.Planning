import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoMeDetailComponent } from './eo-me-detail.component';

describe('EoMeDetailComponent', () => {
  let component: EoMeDetailComponent;
  let fixture: ComponentFixture<EoMeDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoMeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoMeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
