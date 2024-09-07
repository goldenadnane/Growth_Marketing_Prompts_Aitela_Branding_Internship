/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UserModule} from "./user/user.module";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule} from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { PlanModule } from './plan/plan.module';
import { PromptModule } from './prompt/prompt.module';
import { PaymentModule } from './payment/payment.module';
import { IsUniqueConstraint } from './user/dto/is_unique_on_create';
import { IsUniqueOnUpdateConstraint } from './user/dto/is_unique_on_update';
import { HomeModule } from './home/home.module';
//import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthenticateTokenMiddleware } from './middleware/AuthenticateTokenMiddleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AiModule } from './gmp_ai/ai.module';

const envFilePath ='.env';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    SubcategoryModule,
    ConversationModule,
    MessageModule,
    PlanModule,
    PromptModule,
    PaymentModule,
    HomeModule,
    AiModule,
    JwtModule.register({
      secretOrPrivateKey:process.env.JWT_SECRET,
      signOptions: { expiresIn: '5h' }, // Set your preferred expiration time
    }),


  ],
  controllers: [AppController],
  providers: [AppService,IsUniqueConstraint,IsUniqueOnUpdateConstraint , JwtService, {
    provide: APP_GUARD,
    useClass: AuthenticateTokenMiddleware,
  },],
})
export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateTokenMiddleware).exclude(
      { path: '/auth/login', method: RequestMethod.ALL },
      { path: '/users/register',method :RequestMethod.ALL},
      { path: '/plans/all',method :RequestMethod.ALL},
      { path: '/plans/active',method :RequestMethod.ALL},
      { path: '/auth/google/',method :RequestMethod.ALL},
      { path: '/auth/google/callback',method :RequestMethod.ALL},

      
    )
    
   .forRoutes('*');

    
  

  }
}