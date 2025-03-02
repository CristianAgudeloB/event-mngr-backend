import { Request, Response, RequestHandler } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUser: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'El usuario no existe' });
      return;
    }
    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.updateUser(userId, req.body);
    res.json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
};