import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NefComponent } from './nef.component';

describe('NefComponent', () => {
  let component: NefComponent;
  let fixture: ComponentFixture<NefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
