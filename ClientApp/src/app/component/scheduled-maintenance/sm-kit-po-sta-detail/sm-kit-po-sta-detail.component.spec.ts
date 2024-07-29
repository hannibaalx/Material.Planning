import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmKitPoStaDetailComponent } from './sm-kit-po-sta-detail.component';

describe('SmKitPoStaDetailComponent', () => {
  let component: SmKitPoStaDetailComponent;
  let fixture: ComponentFixture<SmKitPoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmKitPoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmKitPoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
