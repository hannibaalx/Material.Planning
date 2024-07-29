import { TestBed } from '@angular/core/testing';

import { EoSupervisorViewService } from './eo-supervisor-view.service';

describe('EoSupervisorViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EoSupervisorViewService = TestBed.get(EoSupervisorViewService);
    expect(service).toBeTruthy();
  });
});
