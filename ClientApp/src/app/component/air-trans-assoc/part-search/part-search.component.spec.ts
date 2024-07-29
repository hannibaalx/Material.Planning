import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartSearchComponent } from './part-search.component';

describe('PartSearchComponent', () => {
  let component: PartSearchComponent;
  let fixture: ComponentFixture<PartSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
