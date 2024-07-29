import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SesExpendableShortageDetailComponent } from './ses-expendable-shortage-detail.component';

describe('SesExpendableShortageDetailComponent', () => {
  let component: SesExpendableShortageDetailComponent;
  let fixture: ComponentFixture<SesExpendableShortageDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SesExpendableShortageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesExpendableShortageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
