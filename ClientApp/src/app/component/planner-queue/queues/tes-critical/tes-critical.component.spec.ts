import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TesCriticalComponent } from './tes-critical.component';

describe('TesCriticalComponent', () => {
  let component: TesCriticalComponent;
  let fixture: ComponentFixture<TesCriticalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TesCriticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesCriticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
