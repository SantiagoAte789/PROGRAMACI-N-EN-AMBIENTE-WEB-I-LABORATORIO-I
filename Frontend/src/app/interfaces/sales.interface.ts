import { ReservationState } from './reservation.interface';

/**
 * Reservación con datos del cliente y del evento,
 * tal como la entrega la API `/api/reservations`.
 */
export interface ReservationDetail {
    codigo: number;
    cliente: string;
    correo: string;
    evento_codigo: number;
    evento: string;
    categoria: string;
    teatro: string;
    ciudad: string;
    entradas: number;
    total: number;
    fecha_reserva: string;
    observaciones: string | null;
    estado: ReservationState;
}

/** Filtros opcionales del listado de reservaciones. */
export interface ReservationFilters {
    estado?: ReservationState;
    evento?: number;
}

export interface SalesTotals {
    total_reservas: number;
    confirmadas: number;
    reservadas: number;
    canceladas: number;
    entradas_vendidas: number;
    ingresos_confirmados: number;
    ingresos_pendientes: number;
}

export interface SalesByEvent {
    codigo: number;
    nombre: string;
    capacidad: number;
    entradas: number;
    ingresos_confirmados: number;
    ingresos_pendientes: number;
    /** Porcentaje de ocupación (0-100). */
    ocupacion: number;
}

/** Respuesta de `/api/reservations/summary`. */
export interface SalesSummary {
    totales: SalesTotals;
    por_evento: SalesByEvent[];
}
