/* eslint-disable prettier/prettier */
import {Injectable,HttpException,HttpStatus, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from 'src/entities/plan.entity';
import Stripe from 'stripe';


@Injectable()
export class PlanService {
    private stripe: Stripe;
    constructor(@Inject('STRIPE_API_KEY') private stripeApiKey: string,
        @InjectRepository(Plan)
       private planRepository: Repository<Plan>,
    ) {
        this.stripe = new Stripe(stripeApiKey, {
            apiVersion: '2022-11-15', // Replace with the desired Stripe API version
          });
    }


     //search plans 
     async searchPlans(searchquery: string): Promise<Plan[]> {
        const plans=await this.planRepository
          .createQueryBuilder('plan')
          .where('plan.name LIKE :query', { query: `%${searchquery}%` })
          .orWhere('plan.payment_cycle LIKE :query', { query: `%${searchquery}%` })
          .getMany();
          
          return plans
      }
    // get all plans
    async findall(): Promise<Plan[]> {
        return await this.planRepository.find();
    }

    // get one plan
    async findOne(id: number): Promise<Plan> {
        const plan = await this.planRepository.findOne({ where : { id } });
        if(!plan){
            throw new HttpException('Plan Not Found', HttpStatus.NOT_FOUND);
        }
        return  plan;
    }


    
    // update plan
    async update(id: number,planData: {name:string,price: number, payment_cycle: 'day' | 'week' | 'month' | 'year', currency: string,is_available:boolean,pre_made_prompt:number,
    chat_per_day:number,saved_prompt:number,custom_instructions:number}): Promise<Plan> {
      const {name,price,payment_cycle, currency ,is_available,pre_made_prompt,chat_per_day,saved_prompt,custom_instructions} = planData;


        const plann=await this.planRepository.findOne( { where : { id } } );
        if(!plann){
            throw new HttpException("Plan does not exist",HttpStatus.CONFLICT)
        }
        plann.name=name,
        plann.price=price,
        plann.currency=currency,
        plann.is_available=is_available,
        plann.payment_cycle=payment_cycle,
        plann.pre_made_prompt=pre_made_prompt,
        plann.chat_per_day=chat_per_day,
        plann.saved_prompt=saved_prompt,
        plann.custom_instructions=custom_instructions

        await this.planRepository.update(id,plann)
        return this.findOne(id)


    }

    // delete plan
    async delete(id: number): Promise<void> {
        const plan = await this.findOne(id);
        if (!plan) {
            throw new Error("Plan not found !")
        }
        await this.planRepository.delete(id);
    }
    async findone(name: string): Promise<Plan> {
        return this.planRepository.findOne({ where: {name}});
}
    
async createPlan(planData: {name:string,price: number, payment_cycle : 'month' | 'year', currency: string,is_available:boolean,
pre_made_prompt:number,chat_per_day:number,saved_prompt:number,custom_instructions:number}): Promise<Stripe.Plan> {

    try {

      const {name,price,payment_cycle, currency,is_available,pre_made_prompt,chat_per_day,saved_prompt,custom_instructions} = planData;
     


      

      const plann=new Plan()
      plann.name=name;
      plann.price=price;
      plann.payment_cycle=payment_cycle;
      plann.is_available=is_available;
      plann.currency=currency;
      plann.pre_made_prompt=pre_made_prompt,
      plann.chat_per_day=chat_per_day,
      plann.saved_prompt=saved_prompt,
      plann.custom_instructions=custom_instructions
      

      await this.planRepository.save(plann);
      console.log("gbfbgrb",plann)


      const plan = await this.stripe.plans.create({
        id:plann.id.toString(),
        amount:price*100,
        interval:payment_cycle,
        currency,
        active:plann.is_available,
     
        
        product: {
          name:plann.name, // Replace with your product name
          id:plann.id.toString(),
          active:plann.is_available
        
        
          
        },
       
        metadata: {
          pre_made_prompt: pre_made_prompt.toString(),
          chat_per_day: chat_per_day.toString(),
          saved_prompt: saved_prompt.toString(),
          custom_instructions: custom_instructions.toString(), // Store the features as metadata in Stripe
        },
        
    
      });

      return plan;
    } catch (error) {
      // Handle error
      throw new Error('Failed to create Plan');
    }
  }



  async findActivePlans(): Promise<Plan[] | Plan> {
    return this.planRepository.find({
      where: {
        is_available: true,
      },
    });
  }


}