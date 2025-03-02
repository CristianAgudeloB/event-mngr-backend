import { Request, Response, RequestHandler } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
  
  export const getUser: RequestHandler = async (req, res, next) => {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (!user) {
        res.status(404).json({ error: 'El usuario no existe' });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      next(error);
    }
  };

  export const updateUser = async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(
        parseInt(req.params.id),
        req.body
      );
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
  
  export const deleteUser = async (req: Request, res: Response) => {
    try {
      await userService.deleteUser(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };