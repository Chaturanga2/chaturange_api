import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('No token provided.');
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer') {
      return res.status(401).send('Invalid token.');
    }
    // verify if the token is valid or not and return the result to the client
    const isTokenValid = this.isValidateToken(token);
    console.log(isTokenValid);
    if (!isTokenValid) {
      return res.status(401).send('Invalid token');
    }
    next();
  }

  isValidateToken(token: string): boolean {
    try {
      const payload = this.jwtService.verify(token, { secret: 'mamamia' });
      return true;
    } catch (error) {
      return false;
    }
  }
}
