import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Im3NavMenuComponent } from './im3-nav-menu.component';

describe('Im3NavMenuComponent', () => {
  let component: Im3NavMenuComponent;
  let fixture: ComponentFixture<Im3NavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Im3NavMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Im3NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
