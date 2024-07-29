import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EcoDetailComponent } from './eco-detail.component';

describe('EcoDetailComponent', () => {
  let component: EcoDetailComponent;
  let fixture: ComponentFixture<EcoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
