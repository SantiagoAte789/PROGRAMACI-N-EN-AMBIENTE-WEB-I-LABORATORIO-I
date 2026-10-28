import { Router } from "express";
import { ExampleController } from "./example.controller";

export class ExampleRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new ExampleController();

    router.get("/students", controller.getAllStudentsExample);
    router.get("/courses", controller.getAllCoursesExample);
    router.get("/enrollments", controller.getAllEnrollmentsExample);
    router.get("/full", controller.getAllFull);

    return router;
  }
}