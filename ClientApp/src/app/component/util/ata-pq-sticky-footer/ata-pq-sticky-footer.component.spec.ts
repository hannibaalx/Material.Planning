import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtaPqStickyFooterComponent } from './ata-pq-sticky-footer.component';

describe('AtaPqStickyFooterComponent', () => {
  let component: AtaPqStickyFooterComponent;
  let fixture: ComponentFixture<AtaPqStickyFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaPqStickyFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaPqStickyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
