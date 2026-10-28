import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeEsCo from '@angular/common/locales/es-CO';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from '../../config/api.config';
import { CatalogEvent } from '../../interfaces/catalog-event.interface';
import { ClientCatalogPage } from './client-catalog.page';

registerLocaleData(localeEsCo);

const EVENT: CatalogEvent = {
  codigo: 1001,
  nombre: 'Festival de Música del Valle',
  descripcion: 'Festival con artistas nacionales y locales.',
  categoria: 'Música',
  teatro: 'Coliseo de Ferias',
  ciudad: 'Tuluá',
  direccion: 'Carrera 40 # 24-30',
  fecha_inicio: '2026-12-05T18:00:00',
  fecha_fin: '2026-12-05T23:30:00',
  capacidad: 120,
  precio: 85000,
  observaciones: null,
  estado: 'Programado',
  entradas_reservadas: 9,
  entradas_disponibles: 111,
};

describe('ClientCatalogPage', () => {
  let fixture: ComponentFixture<ClientCatalogPage>;
  let httpMock: HttpTestingController;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const isEventsList = (r: { url: string }) => r.url === `${API_URL}/events`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCatalogPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'es-CO' },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ClientCatalogPage);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    httpMock.expectOne(isEventsList).flush([]);
    httpMock.expectOne(`${API_URL}/events/filters`).flush({ estados: [], ciudades: [], categorias: [] });
  });

  it('should render the events returned by the API', () => {
    httpMock.expectOne(`${API_URL}/events/filters`).flush({
      estados: ['Programado'],
      ciudades: ['Tuluá'],
      categorias: ['Música'],
    });
    httpMock.expectOne(isEventsList).flush([EVENT]);
    fixture.detectChanges();

    expect(text()).toContain('Festival de Música del Valle');
    expect(text()).toContain('Coliseo de Ferias');
    expect(text()).toContain('111 de 120');
    expect(text()).toMatch(/\$\s*85\.000/);
    expect(text()).toContain('1 evento encontrado');
  });

  it('should show an error message when the API fails', () => {
    httpMock.expectOne(`${API_URL}/events/filters`).flush({ estados: [], ciudades: [], categorias: [] });
    httpMock.expectOne(isEventsList).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(text()).toContain('No fue posible cargar los eventos');
  });

  it('should show the empty state when there are no events', () => {
    httpMock.expectOne(`${API_URL}/events/filters`).flush({ estados: [], ciudades: [], categorias: [] });
    httpMock.expectOne(isEventsList).flush([]);
    fixture.detectChanges();

    expect(text()).toContain('No hay eventos que coincidan');
  });

  it('should query the API again with the selected filter', () => {
    httpMock.expectOne(`${API_URL}/events/filters`).flush({ estados: ['En Vivo'], ciudades: [], categorias: [] });
    httpMock.expectOne(isEventsList).flush([EVENT]);
    fixture.detectChanges();

    fixture.componentInstance.onSelect('estado', { target: { value: 'En Vivo' } } as unknown as Event);
    fixture.detectChanges();

    const req = httpMock.expectOne(isEventsList);
    expect(req.request.params.get('estado')).toBe('En Vivo');
    req.flush([]);
  });
});
