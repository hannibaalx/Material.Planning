import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmTsxWcNumComponent } from './sm-tsx-wc-num.component';

describe('SmTsxWcNumComponent', () => {
  let component: SmTsxWcNumComponent;
  let fixture: ComponentFixture<SmTsxWcNumComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTsxWcNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTsxWcNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
