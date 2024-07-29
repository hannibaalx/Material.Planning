import { TestBed } from '@angular/core/testing';

import { SmPlannerQueueService } from './sm-planner-queue.service';

describe('SmPlannerQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmPlannerQueueService = TestBed.get(SmPlannerQueueService);
    expect(service).toBeTruthy();
  });
});
