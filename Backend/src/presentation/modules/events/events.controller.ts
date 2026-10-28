import { Request, Response } from "express";
import { CustomError } from "../../../domain/errors/custom.error";
import { HandleError } from "../../../domain/errors/handle.error";
import { EventsService } from "./events.service";

export class EventsController {

  private readonly eventsService = new EventsService();

  /** Devuelve el valor de un query param solo si es un texto no vacío. */
  private readQueryText(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  }

  getAllEvents = (req: Request, res: Response): void => {
    this.eventsService.getAllEvents({
      estado: this.readQueryText(req.query.estado),
      ciudad: this.readQueryText(req.query.ciudad),
      categoria: this.readQueryText(req.query.categoria),
      search: this.readQueryText(req.query.search),
    })
      .then((events) => res.status(200).json(events))
      .catch((error) => HandleError.error(error, res));
  };

  getEventByCode = (req: Request, res: Response): void => {
    const codigo = Number(req.params.codigo);

    if (!Number.isInteger(codigo) || codigo <= 0) {
      HandleError.error(CustomError.badRequest("El código del evento debe ser un entero positivo"), res);
      return;
    }

    this.eventsService.getEventByCode(codigo)
      .then((event) => res.status(200).json(event))
      .catch((error) => HandleError.error(error, res));
  };

  getFilterOptions = (req: Request, res: Response): void => {
    this.eventsService.getFilterOptions()
      .then((options) => res.status(200).json(options))
      .catch((error) => HandleError.error(error, res));
  };
}
