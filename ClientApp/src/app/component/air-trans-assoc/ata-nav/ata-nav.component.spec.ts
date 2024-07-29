import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtaNavComponent } from './ata-nav.component';

describe('AtaNavComponent', () => {
  let component: AtaNavComponent;
  let fixture: ComponentFixture<AtaNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
