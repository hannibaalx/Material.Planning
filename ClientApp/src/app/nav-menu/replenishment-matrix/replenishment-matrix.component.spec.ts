import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplenishmentMatrixComponent } from './replenishment-matrix.component';

describe('ReplenismentMatrixComponent', () => {
  let component: ReplenishmentMatrixComponent;
  let fixture: ComponentFixture<ReplenishmentMatrixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplenishmentMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplenishmentMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
