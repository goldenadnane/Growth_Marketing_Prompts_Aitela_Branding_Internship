/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Home } from 'src/entities/home.entity';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';


@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  controllers: [HomeController],
  providers: [HomeService],
  exports:[HomeService],
})
export class HomeModule {}