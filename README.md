# Proyecto Integrador – Programación en Ambiente Web I

Monorepo con un **frontend en Angular 20** y un **backend en Node.js + Express + PostgreSQL**.

**Laboratorio I – UCEVA · Docente: Jesús David Mejía Vergara**

En este laboratorio se agregaron dos funcionalidades completas (base de datos → API REST → página Angular):

| # | Funcionalidad | Tablas | API REST | Página Angular |
|---|---------------|--------|----------|----------------|
| 1 | **Cartelera de eventos** | `theaters`, `events` | `GET /api/events` · `GET /api/events/filters` · `GET /api/events/:codigo` | `/client/catalog` (tarjetas, filtros y detalle) |
| 2 | **Reservaciones y ventas** | `customers`, `reservations` | `GET /api/reservations` · `GET /api/reservations/summary` | `/agent/sales` (KPIs, gráfica de barras y tabla) |

## Estructura

```
Backend/
  src/database/init.sql, seed.sql            # tablas y datos de prueba
  src/domain/interfaces/                      # event.interface.ts, reservation.interface.ts
  src/presentation/modules/events/            # events.service.ts · events.controller.ts · events.routes.ts
  src/presentation/modules/reservations/      # reservations.service.ts · .controller.ts · .routes.ts
  src/presentation/routes.ts                  # registro de /api/events y /api/reservations
Frontend/
  src/app/config/api.config.ts                # URL base de la API
  src/app/interfaces/                         # catalog-event.interface.ts, sales.interface.ts
  src/app/services/catalog/, sales/           # servicios HttpClient
  src/app/pages/client-catalog/, agent-sales/ # páginas nuevas (lazy loading)
```

## Modelo de datos

```
theaters (1) ────< events (1) ────< reservations >──── (1) customers
```

* `events.teatro_id → theaters.id` (relación 1:N)
* `reservations.evento_id → events.id` y `reservations.cliente_id → customers.id` (relación N:M entre clientes y eventos, resuelta con `reservations`)
* Restricciones: `CHECK` de estados válidos, capacidad > 0, precio ≥ 0, entradas > 0, `fecha_fin > fecha_inicio`, claves únicas en `codigo` y `correo`.

## Puesta en marcha

### 1. Base de datos y backend

```bash
cd Backend
docker compose up -d          # PostgreSQL (puerto 5433) y pgAdmin (8081)
npm install
npm run db:init               # crea las tablas (idempotente)
npm run db:seed               # inserta datos de prueba
npm start                     # http://localhost:3000
```

* Documentación Swagger: <http://localhost:3000/api/docs>
* Variables de entorno: `Backend/.env`

> `npm run db:seed` se puede ejecutar una sola vez sobre una base vacía (los datos de ejemplo del docente no son re-ejecutables). Para reiniciar: `docker compose down -v` y borrar la carpeta `Backend/postgres`.

### 2. Frontend

```bash
cd Frontend
npm install
npm start                     # http://localhost:4200
```

Rutas nuevas (el backend debe estar corriendo):

* Cliente → **Cartelera**: <http://localhost:4200/client/catalog>
* Agente → **Ventas**: <http://localhost:4200/agent/sales>

## Endpoints

### Cartelera de eventos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/events` | Lista de eventos con teatro, ciudad y entradas disponibles. Filtros opcionales: `estado`, `ciudad`, `categoria`, `search` |
| GET | `/api/events/filters` | Estados, ciudades y categorías disponibles |
| GET | `/api/events/:codigo` | Detalle de un evento (`404` si no existe, `400` si el código es inválido) |

### Reservaciones y ventas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reservations` | Reservaciones con cliente y evento. Filtros opcionales: `estado`, `evento` |
| GET | `/api/reservations/summary` | KPIs globales y ventas agrupadas por evento (ingresos, entradas, ocupación) |

Reglas de negocio del resumen: *ingresos confirmados* = reservas `Confirmada`; *ingresos pendientes* = reservas `Reservada`; las `Cancelada` no cuentan como entradas vendidas ni como ingresos.

Todas las consultas usan **parámetros preparados** (`$1`, `$2`…) y los filtros inválidos responden `400` con `{ "error": "..." }`.

## Pruebas

```bash
cd Frontend
npm test
```

Incluye pruebas de los dos servicios (`CatalogService`, `SalesService`) y de las dos páginas (renderizado con datos, estado de error, estado vacío y envío de filtros a la API).

## Estándar de commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): ...`, `fix(scope): ...`, `docs: ...`, `test(scope): ...`, `chore: ...`.
