/* eslint-disable prettier/prettier */
import {Body, Controller, Get,Put} from '@nestjs/common';
import { AppService } from './app.service';



@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'this route is protected'
}


@Put('/update')
async updateEnvVariable(@Body('apikey') apikey?:string,@Body('stripeSecretKey') stripeSecretKey?:string):Promise<string>{


 
  if (apikey) {
    await this.appService.updateApiKey(apikey);
  }

  if (stripeSecretKey) {
    await this.appService.updatestripeSecretKey(stripeSecretKey);
  }

  if (apikey && stripeSecretKey) {

    return `Updated .env file with new values for keys: apikey and stripeSecretKey`;
  } else if (apikey) {
    return `Updated .env file with new value for key apikey`;
  } else if (stripeSecretKey) {
    return `Updated .env file with new value for key stripeSecretKey`;
  } else {
    return `No keys provided for update`;
  }

}


}