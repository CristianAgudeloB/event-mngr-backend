import { Request, Response, RequestHandler } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await eventService.getEvents();
    res.json(events);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
};

export const getEvent: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await eventService.getEventById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Evento no encontrado' });
      return;
    }
    res.json(event);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await eventService.updateEvent(eventId, req.body);
    res.json(event);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id, 10);
    await eventService.deleteEvent(eventId);
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
};
