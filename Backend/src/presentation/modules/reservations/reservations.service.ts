import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import {
  RESERVATION_STATES,
  ReservationDetail,
  ReservationFilters,
  ReservationState,
  SalesByEvent,
  SalesSummary,
  SalesTotals,
} from "../../../domain/interfaces/reservation.interface";

/** Formato ISO local (sin zona horaria) para evitar desfases por huso horario. */
const ISO_LOCAL = `YYYY-MM-DD"T"HH24:MI:SS`;

export class ReservationsService {

  /**
   * Lista las reservaciones (cliente + evento + teatro) con filtros opcionales.
   * Las más recientes primero.
   */
  public async getAllReservations(filters: ReservationFilters = {}): Promise<ReservationDetail[]> {
    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (filters.estado) {
      if (!RESERVATION_STATES.includes(filters.estado as ReservationState)) {
        throw CustomError.badRequest(
          `Estado inválido. Valores permitidos: ${RESERVATION_STATES.join(", ")}`
        );
      }
      params.push(filters.estado);
      conditions.push(`r.estado = $${params.length}`);
    }

    if (filters.evento !== undefined) {
      params.push(filters.evento);
      conditions.push(`e.codigo = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT
        r.codigo,
        c.nombre AS cliente,
        c.correo,
        e.codigo AS evento_codigo,
        e.nombre AS evento,
        e.categoria,
        t.nombre AS teatro,
        t.ciudad,
        r.entradas,
        r.total::float8 AS total,
        to_char(r.fecha_reserva, '${ISO_LOCAL}') AS fecha_reserva,
        r.observaciones,
        r.estado
      FROM reservations r
      INNER JOIN customers c ON c.id = r.cliente_id
      INNER JOIN events e ON e.id = r.evento_id
      INNER JOIN theaters t ON t.id = e.teatro_id
      ${where}
      ORDER BY r.fecha_reserva DESC, r.codigo DESC;
    `;

    const result = await pool.query<ReservationDetail>(sql, params);
    return result.rows;
  }

  /**
   * Resumen de ventas:
   *  - ingresos confirmados: reservaciones 'Confirmada'
   *  - ingresos pendientes: reservaciones 'Reservada'
   *  - las 'Cancelada' no cuentan como entradas vendidas ni como ingresos
   */
  public async getSalesSummary(): Promise<SalesSummary> {
    const totalsSql = `
      SELECT
        COUNT(*)::int AS total_reservas,
        COUNT(*) FILTER (WHERE estado = 'Confirmada')::int AS confirmadas,
        COUNT(*) FILTER (WHERE estado = 'Reservada')::int AS reservadas,
        COUNT(*) FILTER (WHERE estado = 'Cancelada')::int AS canceladas,
        COALESCE(SUM(entradas) FILTER (WHERE estado <> 'Cancelada'), 0)::int AS entradas_vendidas,
        COALESCE(SUM(total) FILTER (WHERE estado = 'Confirmada'), 0)::float8 AS ingresos_confirmados,
        COALESCE(SUM(total) FILTER (WHERE estado = 'Reservada'), 0)::float8 AS ingresos_pendientes
      FROM reservations;
    `;

    const byEventSql = `
      SELECT
        e.codigo,
        e.nombre,
        e.capacidad,
        COALESCE(SUM(r.entradas) FILTER (WHERE r.estado <> 'Cancelada'), 0)::int AS entradas,
        COALESCE(SUM(r.total) FILTER (WHERE r.estado = 'Confirmada'), 0)::float8 AS ingresos_confirmados,
        COALESCE(SUM(r.total) FILTER (WHERE r.estado = 'Reservada'), 0)::float8 AS ingresos_pendientes,
        ROUND(
          COALESCE(SUM(r.entradas) FILTER (WHERE r.estado <> 'Cancelada'), 0) * 100.0 / e.capacidad,
          1
        )::float8 AS ocupacion
      FROM events e
      LEFT JOIN reservations r ON r.evento_id = e.id
      GROUP BY e.id
      ORDER BY ingresos_confirmados DESC, e.codigo ASC;
    `;

    const [totals, byEvent] = await Promise.all([
      pool.query<SalesTotals>(totalsSql),
      pool.query<SalesByEvent>(byEventSql),
    ]);

    const totales = totals.rows[0];
    if (!totales) {
      throw CustomError.internalServer("No fue posible calcular el resumen de ventas");
    }

    return { totales, por_evento: byEvent.rows };
  }
}
