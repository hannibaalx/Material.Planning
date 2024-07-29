import { TestBed } from '@angular/core/testing';

import { PfloginService } from './pflogin.service';

describe('PfloginService', () => {
  let service: PfloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PfloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
