import { TestBed } from '@angular/core/testing';

import { LightOrDarkService } from './light-or-dark.service';

describe('LightOrDarkService', () => {
  let service: LightOrDarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightOrDarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
