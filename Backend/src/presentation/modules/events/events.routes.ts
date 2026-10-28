import { Router } from "express";
import { EventsController } from "./events.controller";

export class EventsRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new EventsController();

    /**
     * @openapi
     * /api/events:
     *   get:
     *     summary: Lista la cartelera de eventos
     *     description: Devuelve los eventos con su teatro, ciudad y disponibilidad de entradas. Admite filtros opcionales.
     *     tags: [Cartelera de eventos]
     *     parameters:
     *       - in: query
     *         name: estado
     *         schema:
     *           type: string
     *           enum: [Programado, En Boleteria, En Vivo, Finalizado, Cancelado]
     *       - in: query
     *         name: ciudad
     *         schema:
     *           type: string
     *           example: Cali
     *       - in: query
     *         name: categoria
     *         schema:
     *           type: string
     *           example: Música
     *       - in: query
     *         name: search
     *         description: Texto a buscar en nombre, descripción o teatro
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Lista de eventos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/CatalogEvent'
     *       400:
     *         description: Filtro inválido
     */
    router.get("/", controller.getAllEvents);

    /**
     * @openapi
     * /api/events/filters:
     *   get:
     *     summary: Opciones disponibles para filtrar la cartelera
     *     tags: [Cartelera de eventos]
     *     responses:
     *       200:
     *         description: Estados, ciudades y categorías disponibles
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/EventFilterOptions'
     */
    router.get("/filters", controller.getFilterOptions);

    /**
     * @openapi
     * /api/events/{codigo}:
     *   get:
     *     summary: Consulta un evento por su código
     *     tags: [Cartelera de eventos]
     *     parameters:
     *       - in: path
     *         name: codigo
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1001
     *     responses:
     *       200:
     *         description: Evento encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CatalogEvent'
     *       400:
     *         description: Código inválido
     *       404:
     *         description: Evento no encontrado
     */
    router.get("/:codigo", controller.getEventByCode);

    return router;
  }
}
