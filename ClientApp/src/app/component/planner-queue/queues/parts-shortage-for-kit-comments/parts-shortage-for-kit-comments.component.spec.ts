import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartsShortageForKitCommentsComponent } from './parts-shortage-for-kit-comments.component';

describe('PartsShortageForKitCommentsComponent', () => {
  let component: PartsShortageForKitCommentsComponent;
  let fixture: ComponentFixture<PartsShortageForKitCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsShortageForKitCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsShortageForKitCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
