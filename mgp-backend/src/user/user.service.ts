/* eslint-disable prettier/prettier */
import {Injectable,HttpException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from './dto/create_user.dto';
import * as bcrypt from 'bcrypt';
import { HttpStatusCode } from 'axios';
import { UpdateUserDto } from './dto/update_user.dto';
import { JwtService } from '@nestjs/jwt';





@Injectable()
export class UserService {
    constructor(
      private jwtService:JwtService,
        @InjectRepository(User)
       private userRepository: Repository<User>,
     
    ) {}


         //search users 
         async searchUsers(searchquery: string): Promise<User[]> {
            const users=await this.userRepository
              .createQueryBuilder('user')
              .where('user.firstname LIKE :query', { query: `%${searchquery}%` })
              .orWhere('user.lastname LIKE :query', { query: `%${searchquery}%` })
              .orWhere('user.username LIKE :query', { query: `%${searchquery}%` })
              .orWhere('user.email LIKE :query', { query: `%${searchquery}%` })
              .getMany();
              
              return users
          }
    // get all users
    async findall(): Promise<User[]> {
        return await this.userRepository.find();
    }

    // get one user with Plan
    async findOne(id: number): Promise<User | undefined> {
      return this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.plan', 'plan') // Eager load the plan
        .where('user.id = :id', { id })
        .getOne();
    }

    //create user
    async create(user: User): Promise<User> {
       
        return await this.userRepository.save(user);
    }




  
    

    // delete user
    async delete(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error("User not found !")
        }
        await this.userRepository.delete(id);
    }




    async findone(email: string): Promise<User|undefined> {
        return await this.userRepository.findOne({ where: {email}});
}
    



createToken(userId: number, email: string,role:string,status:string, firstname : string, lastname: string, logo: string) {
  const payload = { sub: userId,email,role,status, firstname, lastname, logo };
  return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
}

  

     async register(body:UserDto,profile_logo?: Express.Multer.File):Promise<any>{
        const hashedpassword=await bcrypt.hash(body.password, 10);

        const user=new User()
        user.firstname=body.firstname;
        user.lastname=body.lastname;
        user.username=body.username;
        user.email=body.email;
        user.email=body.email;
        user.password=hashedpassword;
        user.role="user";
        user.status="Active";

        
        if(profile_logo){
        user.profile_logo=profile_logo.filename
     }

      const saved =await this.userRepository.save(user);
      if (saved) {
        const token = this.createToken(user.id, user.email,user.role,user.status, user.firstname, user.lastname, user.profile_logo);
        return { token };
      }
      throw new Error("User not Saved")
      

        
     }






     async getUserByResetToken(passwordResetToken:string): Promise<User> {
        return await this.userRepository.findOne({ where:{passwordResetToken}});
     }


         //count total users
         async countUsersByMonth(): Promise<{ totalUsers: number, monthlyCounts: { month: number, totalusers: number }[] }> {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
        
          const totalUsers = await this.userRepository.count();
        
          // Count users per month
          const monthlyCounts = [];
        
          for (let month = 0; month <= currentMonth; month++) {
            const startDate = new Date(currentYear, month, 1);
            const endDate = new Date(currentYear, month + 1, 0);
        
            const totalusers = await this.userRepository.count({
              where: {
                createdAt: Between(startDate, endDate)
              }
            });
        
            monthlyCounts.push({ month: month + 1, totalusers }); // +1 to month to start with fitst month , because the loop begin with 0
          }
        
          return { totalUsers, monthlyCounts };
        }

   
     //add user_profile
      async updateUserProfile(id: number,user:UpdateUserDto,profile_logo?: Express.Multer.File): Promise<any> {
        
        const userr = await this.userRepository.findOne({ where: { id } });

        if (!userr) {
            throw new HttpException('User does not exist', HttpStatusCode.NotFound);
          }
        // Now you can update the user's profile_logo field with the uploaded file path
        if (profile_logo) {
          
          userr.profile_logo =user.profile_logo=profile_logo.filename;
        }
                userr.firstname = user.firstname;
                userr.lastname = user.lastname;
                userr.username = user.username;
                userr.email = user.email;
                userr.status = user.status;
                userr.role = user.role;
            console.log(user);
            
        if (user.confirmPassword) {
          if (user.password === user.confirmPassword) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            userr.password = hashedPassword;
          }else {
            throw new HttpException("Password not correct  !",HttpStatusCode.BadRequest)

          }
            
        }
    
         await this.userRepository.update(id,userr);
        const token = this.createToken(userr.id, user.email,user.role,user.status, user.firstname, user.lastname, user.profile_logo);
        return { token };
        
        // return this.findOne(id)

      }

      /*
      async countUsersInCurrentMonth(): Promise<number> {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.userRepository.count({ where: {createdAt: Between(currentMonthStart, now)}
      });
      }

      async countUsersInPreviousMonth(): Promise<number> {
        const now = new Date();
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.userRepository.count({where:{createdAt: Between(previousMonthStart, currentMonthStart)}
        });
      }
      */

      async getUsersByTotalSpent(): Promise<User[]> {
        return this.userRepository
          .createQueryBuilder('user')
          .where('user.spent > 0')
          .orderBy('user.spent', 'DESC') // Order users by spent amount in descending order
          .take(10) // Limit the result to the top 10 users
          .getMany();
      }

      // for totol revenue of app
      async getTotalSpentByAllUsers(): Promise<{ totalSpent: number, monthlyTotals: { month: number, total: number }[] }> {

        const users = await this.userRepository.find();
        
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        const monthlyTotals = [];

        for (let month = 0; month <= currentMonth; month++) {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);

        // Calculate total spent for this month
        const totalForMonth = users
        .filter(user => user.createdAt >= startDate && user.createdAt <= endDate)
        .reduce((totalSpent, user) => totalSpent + user.spent, 0);

        monthlyTotals.push({ month: month + 1, total: totalForMonth });
        }

      // Calculate the general total
      const totalSpent = monthlyTotals.reduce((total, entry) => total + entry.total, 0);

      return { totalSpent, monthlyTotals };

      }
   


}