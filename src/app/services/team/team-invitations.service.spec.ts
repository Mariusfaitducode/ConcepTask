import { TestBed } from '@angular/core/testing';

import { TeamInvitationsService } from './team-invitations.service';

describe('TeamInvitationsService', () => {
  let service: TeamInvitationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamInvitationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
