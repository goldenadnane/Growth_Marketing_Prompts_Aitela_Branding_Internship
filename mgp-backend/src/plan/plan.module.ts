/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { JwtService } from '@nestjs/jwt';








  @Module({
    imports: [TypeOrmModule.forFeature([Plan])],
    providers: [

      PlanService,
      JwtService,
      
      
      {
        provide: 'STRIPE_API_KEY',
        useValue: 'sk_test_51NuH5NASyuZN7wOoLIYfSKC8ckc3Ns06rJz8h4SilQjTptXrHwbQ7TfzNBtdDMtoCuEYf21QrS14kSzRJgR06WdA00bY3L1EdG',
      },
    ],

  controllers:[PlanController],
  exports:['STRIPE_API_KEY',PlanService]
})
export class PlanModule {}