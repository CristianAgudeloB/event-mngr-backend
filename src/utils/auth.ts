import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = '1h';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): { id: number } => {
  return jwt.verify(token, SECRET_KEY) as { id: number };
};