/* eslint-disable prettier/prettier */
// stripe.controller.ts

import { Controller, Post, Body, HttpException, Param, Get,Req, UseGuards, } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpStatusCode } from 'axios';
import { Request} from 'express';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}




  @Post('create-payment-link/:id_user')
  async createPaymentLink(@Param('id_user') id_user:number,@Body('id_plan') id_plan: number) {
    try {
      const session = await this.paymentService.createPaymentLink(id_user,id_plan);
      return session; // Return the full session object
    } catch (error) {
            throw new HttpException("something is wrong",HttpStatusCode.Forbidden)


    }
  }

  
  @Post('/type_of_content/:id_plan')
  async ChooseTypeOfContentBeforePayment(@Req() req:Request,@Param('id_plan') id_plan:number,@Body('type_of_content') type_of_content:string):Promise<any>{
   console.log(id_plan, type_of_content);
   
      const url = await this.paymentService.ChooseTypeOfContentBeforePayment(req,id_plan,type_of_content)
      console.log("controller", url);
      
      return url
}


  @UseGuards(AdminMiddleware)
  @Get('/all')
  async findallPayments(){
    return await this.paymentService.findallPayments()
  }




}