/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { log } from 'console';





@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  

  public createTypeOrmOptions(): TypeOrmModuleOptions {


if (process.env.MODE === 'DEV') {
  console.log('Current MODE:', process.env.MODE);
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE);


  return {
    type: 'postgres',   
    host: this.config.get<string>('POSTGRES_HOST'),
    port: this.config.get<number>('POSTGRES_PORT'),
    database: this.config.get<string>('POSTGRES_DATABASE'),
    username: this.config.get<string>('POSTGRES_USER'),
    password: this.config.get<string>('POSTGRES_PASSWORD'),
    entities: ['dist/**/*.entity.{ts,js}'],
    //migrations: ['dist/migrations/*.{ts,js}'],
    //migrationsTableName: 'typeorm_migrations',
    logger: 'file',
    synchronize: true, // never use TRUE in production!
    
  };

}else {
  console.log('Current MODE: Production ');
console.log('POSTGRES_DATABASE URL:', process.env.DATABASE_URL);

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: true, // Consider making this false for production
    ssl: { rejectUnauthorized: false }
  }
}
 
   
  }
}
