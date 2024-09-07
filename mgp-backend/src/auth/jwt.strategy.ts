/* eslint-disable prettier/prettier */
import { Injectable} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '3ZcVbqSv6vyXJ2LX7HmJ8Vv3F7bQd5XK' // Replace with your secret key or use from .env file
    });
  }

}
