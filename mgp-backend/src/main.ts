/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator'


async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);


  const config: ConfigService = app.get(ConfigService);
  const port:number = config.get<number>('PORT');

  const corsOptions: CorsOptions = {
    origin:"*", // Replace with your client application URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
    credentials: true, // If you need to send cookies or authentication headers

    optionsSuccessStatus: 200,
  };

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  useContainer(app.select(AppModule),{fallbackOnErrors:true})
  // app.useGlobalGuards(new AuthGuard());
 app.enableCors(corsOptions);

 /*app.use((req, res, next) => {
  req.headers['Authorization'] = `Bearer ${stripeSecretKey}`;
  next();
});

*/


await app.listen(port, () => {
  console.log('[API]' + port);
});
}

bootstrap();
