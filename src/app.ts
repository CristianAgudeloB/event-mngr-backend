import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/event.routes';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/user.routes';
import { middleware as openApiValidator } from 'express-openapi-validator';
import path from 'path';

const prisma = new PrismaClient();
export const app = express();

app.use(cors());
app.use(express.json());
app.use(
  openApiValidator({
    apiSpec: path.join(__dirname, 'openapi.yaml'),
    validateRequests: true,
    validateResponses: false,
    validateApiSpec: true
  })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      errors: err.errors
    }
  });
});

app.use(errorHandler);
app.use('/', eventRoutes);
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Server closed');
  });
});