import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartsShortageForKitComponent } from './parts-shortage-for-kit.component';

describe('PartsShortageForKitComponent', () => {
  let component: PartsShortageForKitComponent;
  let fixture: ComponentFixture<PartsShortageForKitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsShortageForKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsShortageForKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
