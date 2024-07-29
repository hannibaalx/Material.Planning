import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EoBomInventoryComponent } from './eo-bom-inventory.component';

describe('EoBomInventoryComponent', () => {
  let component: EoBomInventoryComponent;
  let fixture: ComponentFixture<EoBomInventoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EoBomInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoBomInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
