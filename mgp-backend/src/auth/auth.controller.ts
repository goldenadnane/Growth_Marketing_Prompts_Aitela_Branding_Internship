/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, HttpException, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dto/login_dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  /*@Post('reset-password')
  async resettPassword(@Body('email') email: string): Promise<{ message: string }> {
    const resetToken = await this.authService.generatePasswordResetToken(email);

    if (!resetToken) {
      return { message: 'User not found.' };
    }

    return { message: 'Password reset email sent successfully.' };
  }
*/

  @Get('get-user')
  async getUser(@Body('passwordResetToken') passwordResetToken:string):Promise<any>{
    const passReset=await this.authService.resetPassword(passwordResetToken);
    if(!passReset){
        throw new HttpException("User not found",HttpStatus.AMBIGUOUS)
    }
    return passReset;

}

@Post('change-password')
async ChangePassword(@Body('passwordResetToken') passwordResetToken: string, @Body('newPassword') newPassword: string,@Body('confirmNewPassword')confirmNewPassword: string){
    return await this.authService.newPassword(passwordResetToken,newPassword,confirmNewPassword)
}




@Post('login')
async signIn(@Body() loginDto:LoginDto): Promise<any> {
  return await this.authService.auth(loginDto);
}
}
