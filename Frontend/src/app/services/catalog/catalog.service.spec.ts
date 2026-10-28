import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../../config/api.config';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request all events without query params when there are no filters', () => {
    service.getEvents().subscribe((events) => expect(events).toEqual([]));

    const req = httpMock.expectOne(`${API_URL}/events`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush([]);
  });

  it('should send only the filters that have a value', () => {
    service.getEvents({ estado: 'En Vivo', ciudad: '', search: 'rock' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${API_URL}/events`);
    expect(req.request.params.get('estado')).toBe('En Vivo');
    expect(req.request.params.get('search')).toBe('rock');
    expect(req.request.params.has('ciudad')).toBe(false);
    req.flush([]);
  });

  it('should request an event by its code', () => {
    service.getEventByCode(1001).subscribe();

    const req = httpMock.expectOne(`${API_URL}/events/1001`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should request the filter options', () => {
    service.getFilterOptions().subscribe();

    httpMock.expectOne(`${API_URL}/events/filters`).flush({ estados: [], ciudades: [], categorias: [] });
  });
});
