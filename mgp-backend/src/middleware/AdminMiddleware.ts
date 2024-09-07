/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware,ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: number;
      email:string;
      role:string;
      status:string;
      username:string;
    }
  }
}

@Injectable()

export class AdminMiddleware implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('Guard executing...');
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = this.jwtService.decode(token) as { sub: number, email: string, role: string, status: string };

        if (!decoded || !decoded.sub) {
          throw new Error('Invalid token');
        }

        const userId = decoded.sub;
        const role = decoded.role;

        request.userId = userId;
        console.log('user role is ', role);

        if (role === "user") {
          throw new UnauthorizedException('Unauthorized Admin');
        }
        return true;
      } catch (err) {
        throw new UnauthorizedException('Unauthorized: ' + err.message);
      }
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}