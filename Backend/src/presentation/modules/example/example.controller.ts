import { Request, Response } from "express";
import { HandleError } from "../../../domain/errors/handle.error";
import { ExampleService } from "./example.service";

export class ExampleController {

  private readonly exampleService = new ExampleService();

  getAllStudentsExample = (req: Request, res: Response): void => {
    this.exampleService.getAllStudentsExample()
    .then((students) => res.status(201).json(students))
    .catch((error) => HandleError.error(error, res));
  };

  getAllCoursesExample = (req: Request, res: Response): void => {
    this.exampleService.getAllCoursesExample()
    .then((courses) => res.status(201).json(courses))
    .catch((error) => HandleError.error(error, res));
  };

  getAllEnrollmentsExample = (req: Request, res: Response): void => {
    this.exampleService.getAllEnrollmentsExample()
    .then((enrollments) => res.status(201).json(enrollments))
    .catch((error) => HandleError.error(error, res));
  };

  getAllFull = (req: Request, res: Response): void => {
    this.exampleService.getAllFull()
    .then((full) => res.status(201).json(full))
    .catch((error) => HandleError.error(error, res));
  };

}
