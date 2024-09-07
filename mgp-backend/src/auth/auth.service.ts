/* eslint-disable prettier/prettier */
import { Body, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { hash } from 'bcrypt';
import * as bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/user/dto/login_dto';


@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService,@Inject(UserService) private readonly userService:UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    /*@Inject(MailchimpService) private readonly mailchimpService: MailchimpService*/) {

    }



    public getUser({ id }): Promise<User> {
      return this.userRepository.findOne({ where: { id } });
    }

    createToken(userId: number, email: string,role:string,status:string, firstname : string, lastname: string, logo: string) {
      const payload = { sub: userId,email,role,status, firstname, lastname, logo };
      return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
    }
  

    
    async auth(LoginDto:LoginDto){
    
      const user = await this.userService.findone(LoginDto.email)
      if (!user) {

        throw new HttpException('User not found', HttpStatusCode.NotFound);

      }
  

      const match = await bcrypt.compare(LoginDto.password, user.password);

      
      if (!match) {
        throw new HttpException('Password is not valid', HttpStatus.FORBIDDEN);
      }
  
      const token = this.createToken(user.id, user.email,user.role,user.status, user.firstname, user.lastname, user.profile_logo);

      return { token };


    }
  

  
     
    

    
  
  
      

    


/*async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await this.userService.findone(email);

    if (!user) {
      return null;
    }

    // Generate a random token (you can use more sophisticated token generation)
    const resetToken = crypto.randomBytes(48).toString('hex');

    // Save the token in the user's record in the database (you should add a column for the token)
    user.passwordResetToken = resetToken;
    
    await this.userService.create(user)

    await this.postmarkService.sendLinkToResetPassword(email, resetToken);

    return resetToken;
  }
  */


  async resetPassword (@Body() passwordResetToken: string) {
    const user = await this.userService.getUserByResetToken(passwordResetToken);

    const currentDate = new Date();
    if (!user || user.passwordResetTokenExpiration < currentDate) {
      return { message: 'Invalid or expired token' };
    }
    return user;
  }


  async newPassword(@Body('passwordResetToken') passwordResetToken: string, @Body('newPassword') newPassword: string,@Body('confirmNewPassword') confirmNewPassword: string) {

    const user = await this.userService.getUserByResetToken(passwordResetToken);
    // return JSON.stringify(user);
    const currentDate = new Date();
    // return JSON.stringify(user) + " PSS: " + user.passwordResetTokenExpiration + " " + currentDate
    if (!user || user.passwordResetTokenExpiration <= currentDate) {
      return { message: 'Invalid or expired token' };
    }
    if (newPassword !== confirmNewPassword) {
        return { message: 'Passwords do not match' };
      

}
    else{

        const hashedPassword = await hash(newPassword, 10);
        user.password=hashedPassword;
        await this.userService.create(user)
    }
  }



}

