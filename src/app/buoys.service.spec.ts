import { TestBed } from '@angular/core/testing';

import { BuoysService } from './buoys.service';

describe('BuoysService', () => {
  let service: BuoysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuoysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
