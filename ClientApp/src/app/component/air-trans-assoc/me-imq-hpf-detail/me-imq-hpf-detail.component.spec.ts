import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeImqHpfDetailComponent } from './me-imq-hpf-detail.component';

describe('MeImqHpfDetailComponent', () => {
  let component: MeImqHpfDetailComponent;
  let fixture: ComponentFixture<MeImqHpfDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeImqHpfDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeImqHpfDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
