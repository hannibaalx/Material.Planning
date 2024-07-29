import { TestBed } from '@angular/core/testing';

import { EoReportService } from './eo-report.service';

describe('EoReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EoReportService = TestBed.get(EoReportService);
    expect(service).toBeTruthy();
  });
});
