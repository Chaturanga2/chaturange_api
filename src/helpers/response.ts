import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// const for 200 messages
export const messages200 = (res: Response, message: string, data: never) => {
  res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'OK',
    data,
  });
};

export const messages400 = (res: Response, message: string) => {
  res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: message,
  });
};

export const messages404 = (res: Response, message: string) => {
  res.status(HttpStatus.NOT_FOUND).json({
    statusCode: HttpStatus.NOT_FOUND,
    message: message,
  });
};

export const messages500 = (res: Response, message: string) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: message,
  });
};
