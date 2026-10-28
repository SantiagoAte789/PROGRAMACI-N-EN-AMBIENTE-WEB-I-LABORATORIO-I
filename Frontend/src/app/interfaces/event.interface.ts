export interface Event {
    codigo: number;
    nombre: string;
    descripcion: string;
    teatro: string;
    ciudad: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    capacidad: number;
    precio: number;
    observaciones: string;
    estado: EventState;
}

export type EventState = 
    | 'Programado'
    | 'En Boleteria'
    | 'En Vivo'
    | 'Finalizado'
    | 'Cancelado';
