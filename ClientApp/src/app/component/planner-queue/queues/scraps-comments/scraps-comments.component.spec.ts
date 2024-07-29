import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScrapsCommentsComponent } from './scraps-comments.component';

describe('ScrapsCommentsComponent', () => {
  let component: ScrapsCommentsComponent;
  let fixture: ComponentFixture<ScrapsCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapsCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
