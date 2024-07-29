import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItsDataComponent } from './its-data.component';

describe('ItsDataComponent', () => {
  let component: ItsDataComponent;
  let fixture: ComponentFixture<ItsDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
