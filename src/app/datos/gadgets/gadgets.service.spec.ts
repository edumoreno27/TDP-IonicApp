import { TestBed } from '@angular/core/testing';

import { GadgetsService } from './gadgets.service';

describe('GadgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GadgetsService = TestBed.get(GadgetsService);
    expect(service).toBeTruthy();
  });
});
