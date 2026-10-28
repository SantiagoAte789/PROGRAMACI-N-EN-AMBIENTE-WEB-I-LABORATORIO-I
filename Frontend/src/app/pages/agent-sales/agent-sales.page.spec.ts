import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeEsCo from '@angular/common/locales/es-CO';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from '../../config/api.config';
import { ReservationDetail, SalesSummary } from '../../interfaces/sales.interface';
import { AgentSalesPage } from './agent-sales.page';

registerLocaleData(localeEsCo);

const SUMMARY: SalesSummary = {
  totales: {
    total_reservas: 2,
    confirmadas: 1,
    reservadas: 1,
    canceladas: 0,
    entradas_vendidas: 7,
    ingresos_confirmados: 340000,
    ingresos_pendientes: 255000,
  },
  por_evento: [
    {
      codigo: 1001,
      nombre: 'Festival de Música del Valle',
      capacidad: 120,
      entradas: 7,
      ingresos_confirmados: 340000,
      ingresos_pendientes: 255000,
      ocupacion: 5.8,
    },
  ],
};

const RESERVATION: ReservationDetail = {
  codigo: 5001,
  cliente: 'Juan David Pérez',
  correo: 'juan.perez@example.com',
  evento_codigo: 1001,
  evento: 'Festival de Música del Valle',
  categoria: 'Música',
  teatro: 'Coliseo de Ferias',
  ciudad: 'Tuluá',
  entradas: 4,
  total: 340000,
  fecha_reserva: '2026-10-02T10:15:00',
  observaciones: null,
  estado: 'Confirmada',
};

describe('AgentSalesPage', () => {
  let fixture: ComponentFixture<AgentSalesPage>;
  let httpMock: HttpTestingController;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const isReservationsList = (r: { url: string }) => r.url === `${API_URL}/reservations`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentSalesPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'es-CO' },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AgentSalesPage);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    httpMock.expectOne(`${API_URL}/reservations/summary`).flush(SUMMARY);
    httpMock.expectOne(isReservationsList).flush([]);
  });

  it('should render the KPIs, the chart and the reservations table', () => {
    httpMock.expectOne(`${API_URL}/reservations/summary`).flush(SUMMARY);
    httpMock.expectOne(isReservationsList).flush([RESERVATION]);
    fixture.detectChanges();

    expect(text()).toMatch(/\$\s*340\.000/);
    expect(text()).toMatch(/\$\s*255\.000/);
    expect(text()).toContain('Ingresos por evento');
    expect(text()).toContain('#5001');
    expect(text()).toContain('Juan David Pérez');
    expect(text()).toContain('Confirmada');
  });

  it('should scale the chart bars relative to the best selling event', () => {
    httpMock.expectOne(`${API_URL}/reservations/summary`).flush(SUMMARY);
    httpMock.expectOne(isReservationsList).flush([]);

    expect(fixture.componentInstance.barWidth(595000)).toBe(100);
    expect(fixture.componentInstance.barWidth(297500)).toBe(50);
  });

  it('should show an error message when the reservations request fails', () => {
    httpMock.expectOne(`${API_URL}/reservations/summary`).flush(SUMMARY);
    httpMock.expectOne(isReservationsList).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(text()).toContain('No fue posible cargar las reservaciones');
  });

  it('should query the API again when a status filter is selected', () => {
    httpMock.expectOne(`${API_URL}/reservations/summary`).flush(SUMMARY);
    httpMock.expectOne(isReservationsList).flush([RESERVATION]);
    fixture.detectChanges();

    fixture.componentInstance.setStatus('Cancelada');
    fixture.detectChanges();

    const req = httpMock.expectOne(isReservationsList);
    expect(req.request.params.get('estado')).toBe('Cancelada');
    req.flush([]);
  });
});
