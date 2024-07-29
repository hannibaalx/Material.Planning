import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EorepairorderComponent } from './eorepairorder.component';

describe('EorepairorderComponent', () => {
  let component: EorepairorderComponent;
  let fixture: ComponentFixture<EorepairorderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EorepairorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorepairorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
