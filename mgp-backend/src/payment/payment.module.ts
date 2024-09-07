/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentService } from './payment.service';
import { UserService } from 'src/user/user.service';
import { PlanService } from 'src/plan/plan.service';
import { PaymentController } from './payment.controller';
import { Plan } from 'src/entities/plan.entity';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';










  @Module({
    imports: [TypeOrmModule.forFeature([Payment,User,Plan])],
    providers: [

      PaymentService,
      UserService,
      PlanService,
      JwtService,
      
      {
        provide: 'STRIPE_API_KEY',
        useValue: 'sk_test_51NuH5NASyuZN7wOoLIYfSKC8ckc3Ns06rJz8h4SilQjTptXrHwbQ7TfzNBtdDMtoCuEYf21QrS14kSzRJgR06WdA00bY3L1EdG',
      },
    ],

  controllers:[PaymentController],
  exports:['STRIPE_API_KEY',PaymentService,UserService,PlanService]
})
export class PaymentModule {}