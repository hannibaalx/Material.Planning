import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdPartsShortageComponent } from './ad-parts-shortage.component';

describe('AdPartsShortageComponent', () => {
  let component: AdPartsShortageComponent;
  let fixture: ComponentFixture<AdPartsShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdPartsShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPartsShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
