import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';
import {
  CatalogEvent,
  CatalogFilterOptions,
  CatalogFilters,
} from '../../interfaces/catalog-event.interface';

/** Consume la API REST `/api/events` (cartelera de eventos). */
@Injectable({
  providedIn: 'root',
})
export class CatalogService {

  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/events`;

  /** Lista los eventos; solo envía los filtros que tengan valor. */
  getEvents(filters: CatalogFilters = {}): Observable<CatalogEvent[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }

    return this.http.get<CatalogEvent[]>(this.url, { params });
  }

  /** Consulta el detalle de un evento por su código. */
  getEventByCode(codigo: number): Observable<CatalogEvent> {
    return this.http.get<CatalogEvent>(`${this.url}/${codigo}`);
  }

  /** Estados, ciudades y categorías disponibles para los filtros. */
  getFilterOptions(): Observable<CatalogFilterOptions> {
    return this.http.get<CatalogFilterOptions>(`${this.url}/filters`);
  }
}
