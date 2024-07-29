import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoDiscrepancyComponent } from './po-discrepancy.component';

describe('PoDiscrepancyComponent', () => {
  let component: PoDiscrepancyComponent;
  let fixture: ComponentFixture<PoDiscrepancyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
