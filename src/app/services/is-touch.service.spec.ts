import { TestBed } from '@angular/core/testing';

import { IsTouchService } from './is-touch.service';

describe('IsTouchService', () => {
  let service: IsTouchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsTouchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
