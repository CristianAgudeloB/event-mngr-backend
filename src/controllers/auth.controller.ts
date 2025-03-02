import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { generateToken } from '../utils/auth';

const userService = new UserService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(401).json({ error: errorMessage });
  }
};
