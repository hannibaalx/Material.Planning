import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewStationsChangesComponent } from './new-stations-changes.component';

describe('NewStationsChangesComponent', () => {
  let component: NewStationsChangesComponent;
  let fixture: ComponentFixture<NewStationsChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStationsChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStationsChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
