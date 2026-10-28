import { Router } from "express";
import { EventsRoutes } from "./modules/events/events.routes";
import { ExampleRoutes } from "./modules/example/example.routes";
import { ReservationsRoutes } from "./modules/reservations/reservations.routes";

export class AppRoutes {

  static get routes(): Router {
    const router = Router();
    const apiRouter = Router();

    // Definir rutas
    apiRouter.use("/example", ExampleRoutes.routes);
    apiRouter.use("/events", EventsRoutes.routes);
    apiRouter.use("/reservations", ReservationsRoutes.routes);

    router.use("/api", apiRouter);

    return router;
  }
}