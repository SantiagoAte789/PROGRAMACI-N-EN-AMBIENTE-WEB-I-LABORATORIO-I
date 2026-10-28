/** Estados válidos de un evento (coinciden con el CHECK de la tabla `events`). */
export const EVENT_STATES = [
  "Programado",
  "En Boleteria",
  "En Vivo",
  "Finalizado",
  "Cancelado",
] as const;

export type EventState = (typeof EVENT_STATES)[number];

/** Evento de la cartelera, ya unido con su teatro y con la disponibilidad calculada. */
export interface CatalogEvent {
  codigo: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  teatro: string;
  ciudad: string;
  direccion: string;
  /** Fecha local en formato ISO sin zona horaria (YYYY-MM-DDTHH:mm:ss). */
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  precio: number;
  observaciones: string | null;
  estado: EventState;
  entradas_reservadas: number;
  entradas_disponibles: number;
}

/** Filtros opcionales aceptados por el listado de eventos. */
export interface EventFilters {
  estado?: string | undefined;
  ciudad?: string | undefined;
  categoria?: string | undefined;
  search?: string | undefined;
}

/** Valores disponibles para poblar los filtros de la cartelera. */
export interface EventFilterOptions {
  estados: readonly EventState[];
  ciudades: string[];
  categorias: string[];
}
