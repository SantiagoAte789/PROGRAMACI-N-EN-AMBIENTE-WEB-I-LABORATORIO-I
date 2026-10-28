/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Representa un usuario del sistema
 *       required:
 *         - id
 *         - name
 *         - lastname
 *         - age
 *         - email
 *         - engineering
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Carlos
 *         lastname:
 *           type: string
 *           example: Ramírez
 *         age:
 *           type: number
 *           example: 22
 *         email:
 *           type: string
 *           format: email
 *           example: carlos.ramirez@example.com
 *         engineering:
 *           type: string
 *           enum:
 *             - Sistemas
 *             - Electronica
 *             - Biomedica
 *             - Industrial
 *             - Ambiental
 *           example: Sistemas
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       description: Representa un producto del sistema
 *       required:
 *         - id
 *         - name
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Leche entera
 *         category:
 *           type: string
 *           enum:
 *             - Lacteos
 *             - Carnes
 *             - Frutas
 *             - Verduras
 *           example: Lacteos
 *         price:
 *           type: number
 *           example: 4500
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     CatalogEvent:
 *       type: object
 *       description: Evento de la cartelera con su teatro y disponibilidad
 *       properties:
 *         codigo: { type: integer, example: 1001 }
 *         nombre: { type: string, example: Festival de Música del Valle }
 *         descripcion: { type: string }
 *         categoria: { type: string, example: Música }
 *         teatro: { type: string, example: Coliseo de Ferias }
 *         ciudad: { type: string, example: Tuluá }
 *         direccion: { type: string, example: "Carrera 40 # 24-30" }
 *         fecha_inicio: { type: string, example: "2026-12-05T18:00:00" }
 *         fecha_fin: { type: string, example: "2026-12-05T23:30:00" }
 *         capacidad: { type: integer, example: 120 }
 *         precio: { type: number, example: 85000 }
 *         observaciones: { type: string, nullable: true }
 *         estado:
 *           type: string
 *           enum: [Programado, En Boleteria, En Vivo, Finalizado, Cancelado]
 *         entradas_reservadas: { type: integer, example: 9 }
 *         entradas_disponibles: { type: integer, example: 111 }
 *     EventFilterOptions:
 *       type: object
 *       properties:
 *         estados:
 *           type: array
 *           items: { type: string }
 *         ciudades:
 *           type: array
 *           items: { type: string }
 *         categorias:
 *           type: array
 *           items: { type: string }
 *     Reservation:
 *       type: object
 *       description: Reservación con datos del cliente y del evento
 *       properties:
 *         codigo: { type: integer, example: 5001 }
 *         cliente: { type: string, example: Juan David Pérez }
 *         correo: { type: string, format: email }
 *         evento_codigo: { type: integer, example: 1001 }
 *         evento: { type: string }
 *         categoria: { type: string }
 *         teatro: { type: string }
 *         ciudad: { type: string }
 *         entradas: { type: integer, example: 4 }
 *         total: { type: number, example: 340000 }
 *         fecha_reserva: { type: string, example: "2026-10-02T10:15:00" }
 *         observaciones: { type: string, nullable: true }
 *         estado:
 *           type: string
 *           enum: [Reservada, Confirmada, Cancelada]
 *     SalesSummary:
 *       type: object
 *       properties:
 *         totales:
 *           type: object
 *           properties:
 *             total_reservas: { type: integer }
 *             confirmadas: { type: integer }
 *             reservadas: { type: integer }
 *             canceladas: { type: integer }
 *             entradas_vendidas: { type: integer }
 *             ingresos_confirmados: { type: number }
 *             ingresos_pendientes: { type: number }
 *         por_evento:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               codigo: { type: integer }
 *               nombre: { type: string }
 *               capacidad: { type: integer }
 *               entradas: { type: integer }
 *               ingresos_confirmados: { type: number }
 *               ingresos_pendientes: { type: number }
 *               ocupacion: { type: number, example: 7.5 }
 */
export {};