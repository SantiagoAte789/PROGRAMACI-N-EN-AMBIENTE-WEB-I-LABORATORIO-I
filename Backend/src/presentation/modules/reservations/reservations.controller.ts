import { Request, Response } from "express";
import { CustomError } from "../../../domain/errors/custom.error";
import { HandleError } from "../../../domain/errors/handle.error";
import { ReservationsService } from "./reservations.service";

export class ReservationsController {

  private readonly reservationsService = new ReservationsService();

  getAllReservations = (req: Request, res: Response): void => {
    const estado = typeof req.query.estado === "string" && req.query.estado.trim()
      ? req.query.estado.trim()
      : undefined;

    let evento: number | undefined;
    if (typeof req.query.evento === "string" && req.query.evento.trim()) {
      evento = Number(req.query.evento);
      if (!Number.isInteger(evento) || evento <= 0) {
        HandleError.error(CustomError.badRequest("El parámetro 'evento' debe ser un código entero positivo"), res);
        return;
      }
    }

    this.reservationsService.getAllReservations({ estado, evento })
      .then((reservations) => res.status(200).json(reservations))
      .catch((error) => HandleError.error(error, res));
  };

  getSalesSummary = (req: Request, res: Response): void => {
    this.reservationsService.getSalesSummary()
      .then((summary) => res.status(200).json(summary))
      .catch((error) => HandleError.error(error, res));
  };
}
