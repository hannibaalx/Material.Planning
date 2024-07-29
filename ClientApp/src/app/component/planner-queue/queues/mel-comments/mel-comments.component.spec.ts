import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MelCommentsComponent } from './mel-comments.component';

describe('MelCommentsComponent', () => {
  let component: MelCommentsComponent;
  let fixture: ComponentFixture<MelCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MelCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MelCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
