import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';
import {
  ReservationDetail,
  ReservationFilters,
  SalesSummary,
} from '../../interfaces/sales.interface';

/** Consume la API REST `/api/reservations` (reservaciones y ventas). */
@Injectable({
  providedIn: 'root',
})
export class SalesService {

  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/reservations`;

  /** Lista las reservaciones; solo envía los filtros que tengan valor. */
  getReservations(filters: ReservationFilters = {}): Observable<ReservationDetail[]> {
    let params = new HttpParams();

    if (filters.estado) {
      params = params.set('estado', filters.estado);
    }
    if (filters.evento !== undefined) {
      params = params.set('evento', filters.evento);
    }

    return this.http.get<ReservationDetail[]>(this.url, { params });
  }

  /** Indicadores globales y ventas agrupadas por evento. */
  getSummary(): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.url}/summary`);
  }
}
