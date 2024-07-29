import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MelComponent } from './mel.component';

describe('MelComponent', () => {
  let component: MelComponent;
  let fixture: ComponentFixture<MelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
