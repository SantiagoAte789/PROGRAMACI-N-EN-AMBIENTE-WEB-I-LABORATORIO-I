import { Router } from "express";
import { ReservationsController } from "./reservations.controller";

export class ReservationsRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new ReservationsController();

    /**
     * @openapi
     * /api/reservations:
     *   get:
     *     summary: Lista las reservaciones con su cliente y evento
     *     tags: [Reservaciones y ventas]
     *     parameters:
     *       - in: query
     *         name: estado
     *         schema:
     *           type: string
     *           enum: [Reservada, Confirmada, Cancelada]
     *       - in: query
     *         name: evento
     *         description: Código del evento
     *         schema:
     *           type: integer
     *           example: 1001
     *     responses:
     *       200:
     *         description: Lista de reservaciones (más recientes primero)
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Reservation'
     *       400:
     *         description: Filtro inválido
     */
    router.get("/", controller.getAllReservations);

    /**
     * @openapi
     * /api/reservations/summary:
     *   get:
     *     summary: Resumen de ventas (totales y detalle por evento)
     *     tags: [Reservaciones y ventas]
     *     responses:
     *       200:
     *         description: Indicadores globales y ventas agrupadas por evento
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SalesSummary'
     */
    router.get("/summary", controller.getSalesSummary);

    return router;
  }
}
