import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeEcoInsertHistoryComponent } from './me-eco-insert-history.component';

describe('MeEcoInsertHistoryComponent', () => {
  let component: MeEcoInsertHistoryComponent;
  let fixture: ComponentFixture<MeEcoInsertHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeEcoInsertHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeEcoInsertHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
