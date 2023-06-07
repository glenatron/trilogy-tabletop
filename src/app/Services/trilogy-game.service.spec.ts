import { TestBed } from '@angular/core/testing';

import { TrilogyGameService } from './trilogy-game.service';

describe('TrilogyGameService', () => {
  let service: TrilogyGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrilogyGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
