import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmRoDetailComponent } from './sm-ro-detail.component';

describe('SmRoDetailComponent', () => {
  let component: SmRoDetailComponent;
  let fixture: ComponentFixture<SmRoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
