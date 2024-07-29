import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MereviewComponent } from './mereview.component';

describe('MereviewComponent', () => {
  let component: MereviewComponent;
  let fixture: ComponentFixture<MereviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MereviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MereviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
