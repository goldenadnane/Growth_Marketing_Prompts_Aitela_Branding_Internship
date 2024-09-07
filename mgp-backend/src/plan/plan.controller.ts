/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { PlanService } from './plan.service';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';

@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) {}
  

    //search plans
    @Get('/')
    async searchPlans(@Query('query') searchquery: string): Promise<Plan[]> {
      const plans=await this.planService.searchPlans(searchquery);
      return plans
    }
    //get all plans
    @Get("/all")
    async findAll(): Promise<Plan[]> {
        return await this.planService.findall();
    }

    //get one plan
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Plan> {
        return await this.planService.findOne(id);
   
    }




   

    //update plan
    @Put('/update/:id')
    async update(@Param('id') id: number,@Body() planData: {name:string,price: number, payment_cycle: 'day' | 'week' | 'month' | 'year', currency: string,is_available:boolean,
    pre_made_prompt: number; chat_per_day: number; saved_prompt: number; custom_instructions: number}): Promise<Plan> {
        
      const a=await this.planService.update(id, planData);
        return a
    }

    //delete plan
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.planService.delete(id);
  }



  //create plan
  @UseGuards(AdminMiddleware)
  @Post('create-plan')
async createPlan(@Body() planData: {name:string,price: number, payment_cycle: 'month' | 'year', currency: string,is_available:boolean,
pre_made_prompt: number; chat_per_day: number; saved_prompt: number; custom_instructions: number}) {
  const plan=await this.planService.createPlan(planData)
  return plan

}


 @Get("/active")
 async findActivePlans(){
  return await this.planService.findActivePlans()
 }
}