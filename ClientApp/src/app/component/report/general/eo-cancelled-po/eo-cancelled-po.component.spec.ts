import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoCancelledPoComponent } from './eo-cancelled-po.component';

describe('EoCancelledPoComponent', () => {
  let component: EoCancelledPoComponent;
  let fixture: ComponentFixture<EoCancelledPoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoCancelledPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoCancelledPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
