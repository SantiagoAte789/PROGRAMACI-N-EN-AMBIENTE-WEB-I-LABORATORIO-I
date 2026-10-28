/** Estados válidos de una reservación (coinciden con el CHECK de la tabla `reservations`). */
export const RESERVATION_STATES = ["Reservada", "Confirmada", "Cancelada"] as const;

export type ReservationState = (typeof RESERVATION_STATES)[number];

/** Reservación unida con su cliente, su evento y el teatro del evento. */
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
  /** Fecha local en formato ISO sin zona horaria (YYYY-MM-DDTHH:mm:ss). */
  fecha_reserva: string;
  observaciones: string | null;
  estado: ReservationState;
}

/** Filtros opcionales aceptados por el listado de reservaciones. */
export interface ReservationFilters {
  estado?: string | undefined;
  evento?: number | undefined;
}

/** Indicadores globales de ventas. */
export interface SalesTotals {
  total_reservas: number;
  confirmadas: number;
  reservadas: number;
  canceladas: number;
  entradas_vendidas: number;
  ingresos_confirmados: number;
  ingresos_pendientes: number;
}

/** Ventas agrupadas por evento. */
export interface SalesByEvent {
  codigo: number;
  nombre: string;
  capacidad: number;
  entradas: number;
  ingresos_confirmados: number;
  ingresos_pendientes: number;
  /** Porcentaje de ocupación (0-100) con un decimal. */
  ocupacion: number;
}

export interface SalesSummary {
  totales: SalesTotals;
  por_evento: SalesByEvent[];
}
