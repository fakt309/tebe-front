import { TestBed } from '@angular/core/testing';

import { Touch2Service } from './touch2.service';

describe('Touch2Service', () => {
  let service: Touch2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Touch2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
