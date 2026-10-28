import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../../interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  getAllEvents(): Observable<Event[]> {
    return of([
      {
        codigo: 1001,
        nombre: 'Festival de Música del Valle',
        descripcion: 'Festival con artistas nacionales y locales de diferentes géneros musicales.',
        teatro: 'Coliseo de Ferias',
        ciudad: 'Tuluá',
        fecha_inicio: new Date('2026-10-15T18:00:00'),
        fecha_fin: new Date('2026-10-15T23:30:00'),
        capacidad: 5000,
        precio: 85000,
        observaciones: 'Apertura de puertas a las 5:00 PM.',
        estado: 'Programado'
      },
      {
        codigo: 1002,
        nombre: 'Concierto Sinfónico de Primavera',
        descripcion: 'Presentación de la Orquesta Sinfónica del Valle con repertorio clásico y contemporáneo.',
        teatro: 'Teatro Municipal',
        ciudad: 'Cali',
        fecha_inicio: new Date('2026-10-20T19:00:00'),
        fecha_fin: new Date('2026-10-20T21:30:00'),
        capacidad: 1200,
        precio: 65000,
        observaciones: 'Venta de boletería habilitada en puntos autorizados.',
        estado: 'En Boleteria'
      },
      {
        codigo: 1003,
        nombre: 'Rock al Parque Valle',
        descripcion: 'Festival de rock con participación de bandas nacionales e internacionales.',
        teatro: 'Estadio Doce de Octubre',
        ciudad: 'Tuluá',
        fecha_inicio: new Date('2026-10-06T17:00:00'),
        fecha_fin: new Date('2026-10-06T23:00:00'),
        capacidad: 8000,
        precio: 45000,
        observaciones: 'Evento actualmente en desarrollo.',
        estado: 'En Vivo'
      },
      {
        codigo: 1004,
        nombre: 'Obra de Teatro: El Principito',
        descripcion: 'Adaptación teatral del clásico literario El Principito.',
        teatro: 'Teatro Municipal Enrique Buenaventura',
        ciudad: 'Cali',
        fecha_inicio: new Date('2026-09-28T19:00:00'),
        fecha_fin: new Date('2026-09-28T21:00:00'),
        capacidad: 900,
        precio: 55000,
        observaciones: 'Evento finalizado satisfactoriamente.',
        estado: 'Finalizado'
      },
      {
        codigo: 1005,
        nombre: 'Concierto de Música Urbana',
        descripcion: 'Concierto con los principales exponentes de música urbana de la región.',
        teatro: 'Centro de Eventos Valle del Pacífico',
        ciudad: 'Cali',
        fecha_inicio: new Date('2026-10-10T19:00:00'),
        fecha_fin: new Date('2026-10-10T23:00:00'),
        capacidad: 6000,
        precio: 75000,
        observaciones: 'Evento cancelado por motivos logísticos. Se realizará devolución del dinero.',
        estado: 'Cancelado'
      }
    ]);
  }
  
}
