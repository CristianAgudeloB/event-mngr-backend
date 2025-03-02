import { PrismaClient, Event } from '@prisma/client';

export class EventService {
  private prisma = new PrismaClient();

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    if (!eventData.title || !eventData.date || !eventData.userId) {
      throw new Error('Missing required fields');
    }

    return this.prisma.event.create({
      data: eventData
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id }
    });
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data: eventData
    });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.prisma.event.delete({
      where: { id }
    });
  }
}