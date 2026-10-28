import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../../config/api.config';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request all reservations without query params when there are no filters', () => {
    service.getReservations().subscribe();

    const req = httpMock.expectOne(`${API_URL}/reservations`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush([]);
  });

  it('should send the estado and evento filters', () => {
    service.getReservations({ estado: 'Confirmada', evento: 1001 }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${API_URL}/reservations`);
    expect(req.request.params.get('estado')).toBe('Confirmada');
    expect(req.request.params.get('evento')).toBe('1001');
    req.flush([]);
  });

  it('should request the sales summary', () => {
    service.getSummary().subscribe();

    const req = httpMock.expectOne(`${API_URL}/reservations/summary`);
    expect(req.request.method).toBe('GET');
    req.flush({ totales: {}, por_evento: [] });
  });
});
