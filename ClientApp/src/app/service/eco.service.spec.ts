import { TestBed } from '@angular/core/testing';

import { EcoService } from './eco.service';

describe('EcoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EcoService = TestBed.get(EcoService);
    expect(service).toBeTruthy();
  });
});
