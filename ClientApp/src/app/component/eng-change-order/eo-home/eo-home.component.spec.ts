import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoHomeComponent } from './eo-home.component';

describe('EoHomeComponent', () => {
  let component: EoHomeComponent;
  let fixture: ComponentFixture<EoHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
