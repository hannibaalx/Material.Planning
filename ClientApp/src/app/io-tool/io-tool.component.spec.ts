import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoToolComponent } from './io-tool.component';

describe('IoToolComponent', () => {
  let component: IoToolComponent;
  let fixture: ComponentFixture<IoToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IoToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IoToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
