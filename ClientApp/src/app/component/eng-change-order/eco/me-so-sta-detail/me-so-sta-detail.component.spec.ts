import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeSoStaDetailComponent } from './me-so-sta-detail.component';

describe('MeSoStaDetailComponent', () => {
  let component: MeSoStaDetailComponent;
  let fixture: ComponentFixture<MeSoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeSoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeSoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
