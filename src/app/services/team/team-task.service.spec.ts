import { TestBed } from '@angular/core/testing';

import { TeamTaskService } from './team-task.service';

describe('TeamTaskService', () => {
  let service: TeamTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
