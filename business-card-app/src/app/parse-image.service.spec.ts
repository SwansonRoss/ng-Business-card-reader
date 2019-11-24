import { TestBed } from '@angular/core/testing';

import { ParseImageService } from './parse-image.service';

describe('ParseImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParseImageService = TestBed.get(ParseImageService);
    expect(service).toBeTruthy();
  });
});
