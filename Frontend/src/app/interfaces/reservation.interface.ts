import { Event } from "./event.interface";

export interface Reservation {
    codigo: number;
    fecha: Date;
    total: number;
    entradas: number;
    observaciones: number;
    estado: ReservationState;
    evento: Event;
}

export type ReservationState = 'Reservada' | 'Confirmada' | 'Cancelada';