/* eslint-disable prettier/prettier */
import {  Injectable } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }



  updateApiKey(apikey: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.readFile('.env', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          reject(err); // Rejette la promesse en cas d'erreur
          return;
        }

        const updatedData = data.replace(/apikey=.*/, `apikey=${apikey}`);

        fs.writeFile('.env', updatedData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            reject(err); // Rejette la promesse en cas d'erreur
            return;
          }

          console.log('Api key updated successfully');
          resolve(); // Résout la promesse en cas de succès
        });
      });
    });
  }

  updatestripeSecretKey(stripeSecretKey: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.readFile('.env', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          reject(err); 
          return;
        }

        const updatedData = data.replace(/stripeSecretKey=.*/, `stripeSecretKey=${stripeSecretKey}`);

        fs.writeFile('.env', updatedData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            reject(err); 
            return;
          }

          console.log('Stripe Secret Key updated successfully');
          resolve(); 
        });
      });
    });
  }








  
}
