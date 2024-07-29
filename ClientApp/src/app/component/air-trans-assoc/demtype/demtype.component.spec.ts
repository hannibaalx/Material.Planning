import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemtypeComponent } from './demtype.component';

describe('DemtypeComponent', () => {
  let component: DemtypeComponent;
  let fixture: ComponentFixture<DemtypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
