import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoBomKitDetailsComponent } from './eo-bom-kit-details.component';

describe('EoBomKitDetailsComponent', () => {
  let component: EoBomKitDetailsComponent;
  let fixture: ComponentFixture<EoBomKitDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoBomKitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoBomKitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
