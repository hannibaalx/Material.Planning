import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpenDiscrepancyComponent } from './open-discrepancy.component';

describe('OpenDiscrepancyComponent', () => {
  let component: OpenDiscrepancyComponent;
  let fixture: ComponentFixture<OpenDiscrepancyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
