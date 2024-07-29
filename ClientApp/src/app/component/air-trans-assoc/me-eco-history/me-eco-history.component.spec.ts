import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeEcoHistoryComponent } from './me-eco-history.component';

describe('MeEcoHistoryComponent', () => {
  let component: MeEcoHistoryComponent;
  let fixture: ComponentFixture<MeEcoHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeEcoHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeEcoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
