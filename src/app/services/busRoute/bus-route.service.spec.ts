import { TestBed } from '@angular/core/testing';

import { BusRouteService } from './bus-route.service';

describe('BusRouteService', () => {
  let service: BusRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
