import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmTsxCompareComponent } from './sm-tsx-compare.component';

describe('SmTsxCompareComponent', () => {
  let component: SmTsxCompareComponent;
  let fixture: ComponentFixture<SmTsxCompareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTsxCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTsxCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
