/* eslint-disable prettier/prettier */
import { Injectable, Inject, HttpException, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "axios";
import { Payment } from "src/entities/payment.entity";
import { PlanService } from "src/plan/plan.service";
import { UserDto } from "src/user/dto/create_user.dto";
import { UserService } from "src/user/user.service";
import Stripe from "stripe";
import { Repository } from "typeorm";
import { Request} from "express";

@Injectable()
export class PaymentService {
  private stripe: Stripe;


  url=process.env.FRONT_URL;

  constructor(@Inject('STRIPE_API_KEY') private stripeApiKey: string, @InjectRepository(Payment)
  private paymentRepository: Repository<Payment>,@Inject(UserService) private userService:UserService
  ,@Inject(PlanService) private planService:PlanService) {
    this.stripe = new Stripe(stripeApiKey, {
      apiVersion: '2022-11-15', // Replace with the desired Stripe API version
    });
  }

async createPaymentLink(id_user:number,id_plan:number): Promise<any> {


    
    // Replace with the ID of your recurring Price in Stripe
    try {
      const plan=await this.planService.findOne(id_plan)
      const user = await this.userService.findOne(id_user);

      //console.log('Request received with id_user:', user.id, 'and id_plan:', plan.id);
      if(!user){
        // res.redirect(`${this.url}/auth/register`)
        //return `${this.url}/auth/register`
      }

 


      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url:`https://www.growthmarketing-gpt.com//main/chatbot`,
        cancel_url: `https://www.growthmarketing-gpt.com//auth/register`,
        line_items: [
          {
            
            price_data: {
              currency:plan.currency,
              unit_amount:plan.price*100,
              product:plan.id.toString(),
            
            },
            
            
            quantity: 1,
            
            
        
            
          },
          
        
        ],
        
        
        mode: 'payment',
      
      
        // Add custom metadata
        metadata: {
          id_user: user.id.toString(),
          id_plan: plan.id.toString(),
        
        },
      });

      
      const payment = new Payment();

      payment.user=user,
      payment.plan=plan,
      await this.paymentRepository.save(payment);

    const userdto=new UserDto()
    userdto.spent=user.spent+=plan.price
    userdto.chat_per_day=user.chat_per_day=plan.chat_per_day,
    userdto.custom_instructions=user.custom_instructions=plan.custom_instructions,
    userdto.saved_prompt=user.saved_prompt=plan.saved_prompt,
    userdto.pre_made_prompt=user.pre_made_prompt=plan.pre_made_prompt
    user.plan=plan
    const nextMonth = new Date(payment.payment_date.getFullYear(), payment.payment_date.getMonth() + 2, 0);


    if(user.plan.payment_cycle==="month"){
    user.plan_expiration_date=nextMonth
    }
    else if(user.plan.payment_cycle==="year"){
      const nextYear = new Date(payment.payment_date.getFullYear() + 1, payment.payment_date.getMonth(), payment.payment_date.getDate());
      user.plan_expiration_date = nextYear;
    }

    await this.userService.create(user)
   
    return session.url
    
    // res.redirect(session.url)
      
    } catch (error) {
      console.error('Error in catch block:', error);

      throw new HttpException("something is wrong",HttpStatusCode.Forbidden)

      // Handle error
    }
  }



  async findallPayments():Promise<Payment[] | null>{
    return await this.paymentRepository.find({relations : ['user','plan']}) // {relations : ['user','plan'] to get in addition user and plan infos

}



async ChooseTypeOfContentBeforePayment(@Req() req:Request,id_plan:number,type_of_content:string):Promise<string>{
  
    try{

    const user=await this.userService.findOne(req.userId)
    const plan=await this.planService.findOne(id_plan)

    user.type_of_content=type_of_content
    await this.userService.create(user)

     const session = await this.createPaymentLink(req.userId,plan.id)
    console.log(session);
    // res.redirect(session)

     return session;
}
catch(error){
  throw new Error("Error because of "+error)
}


}

}