import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  status?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // En producción se podría ocultar el stack trace
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name,
    message: err.message,
  });
};
