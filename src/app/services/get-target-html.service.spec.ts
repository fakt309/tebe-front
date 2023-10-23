import { TestBed } from '@angular/core/testing';

import { GetTargetHtmlService } from './get-target-html.service';

describe('GetTargetHtmlService', () => {
  let service: GetTargetHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTargetHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
