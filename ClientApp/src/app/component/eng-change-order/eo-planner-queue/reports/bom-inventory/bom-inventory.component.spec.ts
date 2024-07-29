import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BomInventoryComponent } from './bom-inventory.component';

describe('BomInventoryComponent', () => {
  let component: BomInventoryComponent;
  let fixture: ComponentFixture<BomInventoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BomInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
