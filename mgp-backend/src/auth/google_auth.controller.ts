/* eslint-disable prettier/prettier */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from './google_auth.service';

@Controller('auth/google')
export class AuthGoogleController {
    constructor(private readonly googleauthService: GoogleAuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    //
  }


  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {

   //console.log("req",req.user);
    res.redirect(process.env.FRONT_URL); // Redirect to the homepage or any desired route
  }
}
