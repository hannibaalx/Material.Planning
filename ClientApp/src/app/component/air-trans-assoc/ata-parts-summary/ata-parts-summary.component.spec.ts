import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtaPartsSummaryComponent } from './ata-parts-summary.component';

describe('AtaPartsSummaryComponent', () => {
  let component: AtaPartsSummaryComponent;
  let fixture: ComponentFixture<AtaPartsSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaPartsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaPartsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
