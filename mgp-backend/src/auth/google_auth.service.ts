/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleAuthService extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService :UserService) {
    const url=process.env.BASE_URL

    super({
        clientID:process.env.clientID,
        clientSecret:process.env.clientSecret,
        callbackURL:`${url}/auth/google/callback`,
        scope:[process.env.scope_profile,process.env.scope_email,process.env.scope_logo]
     

    });
  }







  async validate(accessToekn:string,refreshToken:string,profile:any,done: VerifyCallback): Promise<any> {

    const newUser = new User();
    //console.log("access",accessToekn)
    //console.log("refresh",refreshToken)
    //console.log("profile",profile)
    console.log("fotoo",profile.photos[0].value)

    const userEmail = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

    if (!userEmail) {
        // If the email is not available, handle the error
        throw new UnauthorizedException('Email not provided by Google');
    }
    
    try {
    // Check if a user with the given email already exists in your database
    const existingUser = await this.userService.findone(userEmail);

    
    if (existingUser) {

      return existingUser;
    } else {

     
          newUser.email=userEmail,
          newUser.firstname=profile.name.givenName,
          newUser.lastname=profile.name.familyName,
          newUser.username=profile.name.givenName,
          newUser.profile_logo=profile.photos[0].value,
          newUser.password = 'null',
          newUser.role= 'user',
          newUser.spent=0,
          newUser.subscribed=false,
          newUser.pre_made_prompt=0,
          newUser.chat_per_day= 0,
          newUser.saved_prompt= 0,
          newUser.custom_instructions= 0
          await this.userService.create(newUser)
      };

    

      done(null, newUser);

    
}catch(error){
    throw new InternalServerErrorException('Error during Google authentication', error.message);

    }
  }


  
 
  }

