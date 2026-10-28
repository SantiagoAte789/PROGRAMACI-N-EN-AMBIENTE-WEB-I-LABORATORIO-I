import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import {
  CatalogEvent,
  EVENT_STATES,
  EventFilterOptions,
  EventFilters,
  EventState,
} from "../../../domain/interfaces/event.interface";

/** Formato ISO local (sin zona horaria) para evitar desfases por huso horario. */
const ISO_LOCAL = `YYYY-MM-DD"T"HH24:MI:SS`;

/** Consulta base: evento + teatro + entradas reservadas (sin contar canceladas). */
const BASE_SELECT = `
  SELECT
    e.codigo,
    e.nombre,
    e.descripcion,
    e.categoria,
    t.nombre AS teatro,
    t.ciudad,
    t.direccion,
    to_char(e.fecha_inicio, '${ISO_LOCAL}') AS fecha_inicio,
    to_char(e.fecha_fin, '${ISO_LOCAL}') AS fecha_fin,
    e.capacidad,
    e.precio::float8 AS precio,
    e.observaciones,
    e.estado,
    COALESCE(r.entradas_reservadas, 0)::int AS entradas_reservadas,
    (e.capacidad - COALESCE(r.entradas_reservadas, 0))::int AS entradas_disponibles
  FROM events e
  INNER JOIN theaters t ON t.id = e.teatro_id
  LEFT JOIN (
    SELECT evento_id, SUM(entradas) AS entradas_reservadas
    FROM reservations
    WHERE estado <> 'Cancelada'
    GROUP BY evento_id
  ) r ON r.evento_id = e.id
`;

export class EventsService {

  /**
   * Lista los eventos de la cartelera aplicando filtros opcionales.
   * Todos los valores viajan como parámetros ($n) para evitar inyección SQL.
   */
  public async getAllEvents(filters: EventFilters = {}): Promise<CatalogEvent[]> {
    const conditions: string[] = [];
    const params: string[] = [];

    if (filters.estado) {
      if (!EVENT_STATES.includes(filters.estado as EventState)) {
        throw CustomError.badRequest(
          `Estado inválido. Valores permitidos: ${EVENT_STATES.join(", ")}`
        );
      }
      params.push(filters.estado);
      conditions.push(`e.estado = $${params.length}`);
    }

    if (filters.ciudad) {
      params.push(filters.ciudad);
      conditions.push(`t.ciudad = $${params.length}`);
    }

    if (filters.categoria) {
      params.push(filters.categoria);
      conditions.push(`e.categoria = $${params.length}`);
    }

    if (filters.search) {
      params.push(`%${filters.search}%`);
      const p = `$${params.length}`;
      conditions.push(`(e.nombre ILIKE ${p} OR e.descripcion ILIKE ${p} OR t.nombre ILIKE ${p})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `${BASE_SELECT} ${where} ORDER BY e.fecha_inicio ASC, e.codigo ASC;`;

    const result = await pool.query<CatalogEvent>(sql, params);
    return result.rows;
  }

  /** Obtiene un evento por su código; lanza 404 si no existe. */
  public async getEventByCode(codigo: number): Promise<CatalogEvent> {
    const sql = `${BASE_SELECT} WHERE e.codigo = $1;`;
    const result = await pool.query<CatalogEvent>(sql, [codigo]);
    const event = result.rows[0];

    if (!event) {
      throw CustomError.notFound(`No existe un evento con código ${codigo}`);
    }
    return event;
  }

  /** Valores disponibles para construir los filtros de la cartelera. */
  public async getFilterOptions(): Promise<EventFilterOptions> {
    const sql = `
      SELECT
        COALESCE(ARRAY_AGG(DISTINCT t.ciudad ORDER BY t.ciudad), '{}') AS ciudades,
        COALESCE(ARRAY_AGG(DISTINCT e.categoria ORDER BY e.categoria), '{}') AS categorias
      FROM events e
      INNER JOIN theaters t ON t.id = e.teatro_id;
    `;
    const result = await pool.query<{ ciudades: string[]; categorias: string[] }>(sql);
    const row = result.rows[0];

    return {
      estados: EVENT_STATES,
      ciudades: row?.ciudades ?? [],
      categorias: row?.categorias ?? [],
    };
  }
}
