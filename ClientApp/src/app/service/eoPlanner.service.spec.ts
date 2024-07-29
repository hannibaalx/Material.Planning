import { TestBed } from '@angular/core/testing';

import { eoPlannerService } from './eoPlanner.service';

describe('EoplannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: eoPlannerService = TestBed.get(eoPlannerService);
    expect(service).toBeTruthy();
  });
});
