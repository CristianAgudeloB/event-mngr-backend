import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import { hashPassword, generateToken } from '../utils/auth';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Event API', () => {
  let testEventId: number;
  let testUserId: number;
  let testAuthToken: string;
  const testUserEmail = 'test@example.com';
  const testUserPassword = 'password';

  beforeAll(async () => {
    const hashedPassword = await hashPassword(testUserPassword);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testUserEmail,
        password: hashedPassword
      }
    });
    testUserId = user.id;
    testAuthToken = jwt.sign({ id: testUserId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    const event = await prisma.event.create({
      data: {
        title: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        date: new Date(),
        userId: testUserId
      }
    });
    testEventId = event.id;
  });

  afterAll(async () => {
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Auth Operations', () => {
    test('POST /register - Crear nuevo usuario', async () => {
      const newUser = {
        name: "New Test User",
        email: "newuser@example.com",
        password: "newpassword123"
      };

      const response = await request(app)
        .post('/register')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body).toHaveProperty('token');
    });

    test('POST /register - Error al crear usuario duplicado', async () => {
      const duplicateUser = {
        name: "Test User",
        email: testUserEmail,
        password: "password"
      };

      const response = await request(app)
        .post('/register')
        .send(duplicateUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    test('POST /login - Autenticación exitosa', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: testUserEmail,
          password: testUserPassword
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUserEmail);
    });

    test('POST /login - Credenciales inválidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: testUserEmail,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('User Operations', () => {
    test('GET /users - Listar todos los usuarios', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /users - Sin autenticación debe fallar', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(401);
    });

    test('GET /users/:id - Obtener usuario por ID', async () => {
      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body.email).toBe(testUserEmail);
    });

    test('GET /users/:id - Error usuario no encontrado', async () => {
      const response = await request(app)
        .get('/users/9999')
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('PUT /users/:id - Actualizar usuario', async () => {
      const updates = {
        name: "Updated Name",
        email: "updated@example.com"
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.email).toBe(updates.email);
    });

    test('PUT /users/:id - Error email duplicado al actualizar', async () => {
      const secondUser = await prisma.user.create({
        data: {
          name: "Second User",
          email: "second@example.com",
          password: await hashPassword('password')
        }
      });

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .send({ email: "second@example.com" });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already exists');

      await prisma.user.delete({ where: { id: secondUser.id } });
    });

    test('DELETE /users/:id - Eliminar usuario', async () => {
      const tempUser = await prisma.user.create({
        data: {
          name: "Temp User",
          email: "temp@example.com",
          password: await hashPassword('password')
        }
      });

      const tempUserToken = generateToken(tempUser.id);

      const response = await request(app)
        .delete(`/users/${tempUser.id}`)
        .set('Authorization', `Bearer ${tempUserToken}`);
      
      expect(response.status).toBe(204);

      const deletedUser = await prisma.user.findUnique({
        where: { id: tempUser.id }
      });
      expect(deletedUser).toBeNull();
    });

    test('DELETE /users/:id - Error eliminar usuario inexistente', async () => {
      const response = await request(app)
        .delete('/users/9999')
        .set('Authorization', `Bearer ${testAuthToken}`);
      expect(response.status).toBe(500);
    });
  });

  describe('Event Operations', () => {
    let tempEventId: number;

    test('POST /events - Crear nuevo evento', async () => {
      const newEvent = {
        title: 'New Event',
        description: 'New Description',
        location: 'New Location',
        date: new Date().toISOString()
      };
    
      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${testAuthToken}`)
        .send(newEvent);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(testUserId);
      tempEventId = response.body.id;
    });

    test('POST /events - Error al crear evento sin autenticación', async () => {
      const response = await request(app)
        .post('/events')
        .send({
          title: 'Unauthorized Event',
          date: new Date().toISOString()
        });
      
      expect(response.status).toBe(401);
    });

    test('GET /events - Listar todos los eventos', async () => {
      const response = await request(app)
        .get('/events')
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /events/:id - Obtener evento específico', async () => {
      const response = await request(app)
        .get(`/events/${testEventId}`)
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testEventId);
      expect(response.body.title).toBe('Test Event');
    });

    test('PUT /events/:id - Actualizar evento', async () => {
      const updates = {
        title: 'Updated Event Title',
        location: 'New Location'
      };

      const response = await request(app)
        .put(`/events/${testEventId}`)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.location).toBe(updates.location);
    });

    test('DELETE /events/:id - Eliminar evento', async () => {
      const tempEvent = await prisma.event.create({
        data: {
          title: 'Temp Event',
          description: 'Temp Description',
          location: 'Temp Location',
          date: new Date(),
          userId: testUserId
        }
      });
    
      const response = await request(app)
        .delete(`/events/${tempEvent.id}`)
        .set('Authorization', `Bearer ${testAuthToken}`);
      
      expect(response.status).toBe(204);
    
      const deletedEvent = await prisma.event.findUnique({
        where: { id: tempEvent.id }
      });
      expect(deletedEvent).toBeNull();
    });

    test('DELETE /events/:id - Verificar eliminación en cascada de usuario', async () => {
      const tempUser = await prisma.user.create({
        data: {
          name: 'Temp User',
          email: 'tempuser@example.com',
          password: await hashPassword('password'),
          events: {
            create: {
              title: 'User Event',
              description: 'Test Description',
              location: 'Test Location',
              date: new Date()
            }
          }
        },
        include: { events: true }
      });

      const tempUserToken = generateToken(tempUser.id);

      await request(app)
        .delete(`/users/${tempUser.id}`)
        .set('Authorization', `Bearer ${tempUserToken}`);

      const deletedEvent = await prisma.event.findUnique({
        where: { id: tempUser.events[0].id }
      });
      expect(deletedEvent).toBeNull();
    });
  });
});