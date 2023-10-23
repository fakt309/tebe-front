import { TestBed } from '@angular/core/testing';

import { LinerSvgService } from './liner-svg.service';

describe('LinerSvgService', () => {
  let service: LinerSvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinerSvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
