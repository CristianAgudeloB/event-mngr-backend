import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name,
    message: err.message,
  });
};
