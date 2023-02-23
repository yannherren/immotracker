import { TestBed } from '@angular/core/testing';

import { PropertyPriceService } from './property-price.service';

describe('PropertyPriceService', () => {
  let service: PropertyPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
