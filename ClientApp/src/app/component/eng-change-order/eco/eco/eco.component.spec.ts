import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EcoComponent } from './eco.component';

describe('EcoComponent', () => {
  let component: EcoComponent;
  let fixture: ComponentFixture<EcoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
