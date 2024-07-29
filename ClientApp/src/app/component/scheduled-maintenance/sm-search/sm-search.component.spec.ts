import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmSearchComponent } from './sm-search.component';

describe('SmSearchComponent', () => {
  let component: SmSearchComponent;
  let fixture: ComponentFixture<SmSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
