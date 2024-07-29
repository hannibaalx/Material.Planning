import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtaStickyFooterComponent } from './ata-sticky-footer.component';

describe('AtaStickyFooterComponent', () => {
  let component: AtaStickyFooterComponent;
  let fixture: ComponentFixture<AtaStickyFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaStickyFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaStickyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
