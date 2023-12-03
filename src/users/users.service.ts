import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    
    createUser(emai: string, passwor: string, username: string, address: string, phone: number, admin: boolean) {
        const user = this.repo.create({ email: emai, password: passwor, username: username, address: address, phone: phone, admin: admin });

        return this.repo.save(user);
    }

    findOneUser(id: number) {
        if(!id) {
            return null;
        }
        return this.repo.findOneBy({ id: id }); // return just one User entity
    }

    findAllUsers(): Promise<User[]> {
        return this.repo.find();
      }


    findAllUsersWithTheGivenEmail(emai?: string) {
        if (emai) {
            return this.repo.find({ where: { email:emai } });// return an array[] of users => User[]
        } else {
            return this.repo.find(); // Return all users if no email is provided
        }

    }

    
    async removeUser(id: number) {
        const user = await this.findOneUser(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.repo.remove(user);
    }


    async updateUser(id:number, attrs: Partial<User>) {
        const user = await this.findOneUser(id);
        if(!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
}
