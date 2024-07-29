import { TestBed } from '@angular/core/testing';

import { SchedmaintService } from './schedmaint.service';

describe('SchedmaintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedmaintService = TestBed.get(SchedmaintService);
    expect(service).toBeTruthy();
  });
});
