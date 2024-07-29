import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoreportsComponent } from './eoreports.component';

describe('EoreportsComponent', () => {
  let component: EoreportsComponent;
  let fixture: ComponentFixture<EoreportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
