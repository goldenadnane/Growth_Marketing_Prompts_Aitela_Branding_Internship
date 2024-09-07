/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
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
export class AuthenticateTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // console.log('Middleware executing...');
    const authHeader = req.headers.authorization;
        

      if (authHeader) {
        const token = authHeader.split(' ')[1];
    //    //console.log("token ", token);

        try {
          const decoded = this.jwtService.decode(token) as { sub: number, email: string,role:string,status:string };
          if (!decoded || !decoded.sub) {
            throw new Error('Invalid token');
          }

    //     //You can access the user_id from the decoded token
          const userId = decoded.sub;
          //console.log("user",userId)

          // Optionally, you can verify if the token belongs to a user here

    // //     // Store the user_id in the request object for further use
          req.userId = userId;

         next();
        } catch (err) {
          res.status(401).json({ error: 'Unauthorized: ' + err.message });
        }
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
  }
}
