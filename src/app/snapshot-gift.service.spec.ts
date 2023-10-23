import { TestBed } from '@angular/core/testing';

import { SnapshotGiftService } from './snapshot-gift.service';

describe('SnapshotGiftService', () => {
  let service: SnapshotGiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnapshotGiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
