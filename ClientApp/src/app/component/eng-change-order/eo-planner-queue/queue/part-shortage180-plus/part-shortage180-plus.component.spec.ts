import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartShortage180PlusComponent } from './part-shortage180-plus.component';

describe('PartShortage180PlusComponent', () => {
  let component: PartShortage180PlusComponent;
  let fixture: ComponentFixture<PartShortage180PlusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartShortage180PlusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartShortage180PlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
