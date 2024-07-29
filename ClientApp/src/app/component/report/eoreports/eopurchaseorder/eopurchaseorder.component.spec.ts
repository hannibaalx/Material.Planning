import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EopurchaseorderComponent } from './eopurchaseorder.component';

describe('EopurchaseorderComponent', () => {
  let component: EopurchaseorderComponent;
  let fixture: ComponentFixture<EopurchaseorderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EopurchaseorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EopurchaseorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
