import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmKitRoStaDetailComponent } from './sm-kit-ro-sta-detail.component';

describe('SmKitRoStaDetailComponent', () => {
  let component: SmKitRoStaDetailComponent;
  let fixture: ComponentFixture<SmKitRoStaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmKitRoStaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmKitRoStaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
