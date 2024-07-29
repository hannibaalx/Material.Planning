import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatalogExpirationComponent } from './catalog-expiration.component';

describe('CatalogExpirationComponent', () => {
  let component: CatalogExpirationComponent;
  let fixture: ComponentFixture<CatalogExpirationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogExpirationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
