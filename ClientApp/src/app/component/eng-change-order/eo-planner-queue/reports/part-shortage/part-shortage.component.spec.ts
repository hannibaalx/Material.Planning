import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortageComponent } from './part-shortage.component';

describe('PartShortageComponent', () => {
  let component: PartShortageComponent;
  let fixture: ComponentFixture<PartShortageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
