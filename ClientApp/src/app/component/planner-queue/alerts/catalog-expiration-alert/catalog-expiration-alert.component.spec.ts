import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatalogExpirationAlertComponent } from './catalog-expiration-alert.component';

describe('CatalogExpirationAlertComponent', () => {
  let component: CatalogExpirationAlertComponent;
  let fixture: ComponentFixture<CatalogExpirationAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogExpirationAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogExpirationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
