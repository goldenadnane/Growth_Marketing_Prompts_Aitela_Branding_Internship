/* eslint-disable prettier/prettier */
import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from "typeorm";

const dotenvPath = path.resolve(__dirname, '..', 'common', 'envs', '.env');
console.log("sf",path.resolve(__dirname, '..', 'common', 'envs', '.env'))
console.log('envPath:', dotenvPath);


dotenvConfig({ path: dotenvPath }); 

// console.log(process.env.POSTGRES_HOST);

// console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
// console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);
// console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
// console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
// console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE);
// const url = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;
// console.log('url', url);

const isDev = process.env.MODE === 'DEV';
console.log('Current MODE FROM CONFIG :', process.env.MODE);

let config = {}

if ( process.env.MODE === 'DEV') {
   config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    //migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    autoLoadEntities: false,
    synchronize: true,
}
} else {
  config = 
  {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: true, // Consider making this false for production
    ssl: { rejectUnauthorized: false }

  }
}


   

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
