import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoPartShortageComponent } from './eo-part-shortage.component';

describe('EoPartShortageComponent', () => {
  let component: EoPartShortageComponent;
  let fixture: ComponentFixture<EoPartShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoPartShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPartShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
