import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KitShortageByPartsComponent } from './kit-shortage-by-parts.component';

describe('KitShortageByPartsComponent', () => {
  let component: KitShortageByPartsComponent;
  let fixture: ComponentFixture<KitShortageByPartsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KitShortageByPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitShortageByPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
