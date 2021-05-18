import { TestBed } from '@angular/core/testing';

import { LiverouteService } from './liveroute.service';

describe('LiverouteService', () => {
  let service: LiverouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiverouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
