import { EventState } from './event.interface';

/**
 * Evento de la cartelera tal como lo entrega la API `/api/events`.
 * Las fechas llegan como texto ISO local (sin zona horaria).
 */
export interface CatalogEvent {
    codigo: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    teatro: string;
    ciudad: string;
    direccion: string;
    fecha_inicio: string;
    fecha_fin: string;
    capacidad: number;
    precio: number;
    observaciones: string | null;
    estado: EventState;
    entradas_reservadas: number;
    entradas_disponibles: number;
}

/** Filtros opcionales del listado de eventos. */
export interface CatalogFilters {
    search?: string;
    estado?: string;
    ciudad?: string;
    categoria?: string;
}

/** Valores disponibles para poblar los filtros de la cartelera. */
export interface CatalogFilterOptions {
    estados: string[];
    ciudades: string[];
    categorias: string[];
}
