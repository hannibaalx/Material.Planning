import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewDash8WithNoBomComponent } from './new-dash8-with-no-bom.component';

describe('NewDash8WithNoBomComponent', () => {
  let component: NewDash8WithNoBomComponent;
  let fixture: ComponentFixture<NewDash8WithNoBomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDash8WithNoBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDash8WithNoBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
