import { User } from '@prisma/client';
import prisma from '../prisma';
import { hashPassword, comparePassword } from '../utils/auth';

export class UserService {
  private prisma = prisma;

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Se requieren todos los campos: name, email y password');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('El email ya existe');
    }

    const hashedPassword = await hashPassword(userData.password);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('El usuario no existe');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales incorrectas');
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    if (userData.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error('El email ya existe');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
