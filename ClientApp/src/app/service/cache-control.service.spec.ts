import { TestBed } from '@angular/core/testing';

import { CacheControlService } from './cache-control.service';

describe('CacheControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheControlService = TestBed.get(CacheControlService);
    expect(service).toBeTruthy();
  });
});
