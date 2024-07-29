import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KitShortageForPartsCommentsComponent } from './kit-shortage-for-parts-comments.component';

describe('KitShortageForPartsCommentsComponent', () => {
  let component: KitShortageForPartsCommentsComponent;
  let fixture: ComponentFixture<KitShortageForPartsCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KitShortageForPartsCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitShortageForPartsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
