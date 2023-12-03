import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto'; // Salt and hash
import { promisify } from 'util'; // enable using Promise for Scrypt

const scryption = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(mail: string, pass: string, username: string, address: string, phone: number, admin: boolean) {

    // Check if the email is already in use, return an array of user
    // if userExistence = [], then continue to execute
    // if userExistence = [email: 'useremail', password: 'userpassword'], throw an error because user has already existed in the database
    const userExistence = await this.usersService.findAllUsersWithTheGivenEmail(mail);
    if (userExistence.length) {
      throw new BadRequestException('this email is currently in use');
    }

    // Hash the user's password
    // Generate Salt
    const salt = randomBytes(8).toString('hex');

    // Hash the Salt and the password together
    const hashedPassword = (await scryption(pass, salt, 32)) as Buffer;

    // Join the hashed refult with the salt together
    const encryptedPassword = salt + '.' + hashedPassword.toString('hex');

    // Create a new user and save it
    const user = this.usersService.createUser(mail, encryptedPassword, username, address, phone, admin);

    // Return the user
    return user;
  }

  async signin(mail: string, pass: string) {
    const [user] = await this.usersService.findAllUsersWithTheGivenEmail(mail); // this await will give back an entire array, so use destructoring here
    if (!user) {
      // because if you write user =, it will give back to you a whole array
      throw new NotFoundException("user's email not found");
    }

    // split salt và storedHashedPassword bằng dấu .
    const [salt, storedHashedPassword] = user.password.split('.');

    // user sign in bằng password và được hashed (hashedPassword ở dạng 1010101010101010)
    const hashedPassword = (await scryption(pass, salt, 32)) as Buffer;

    // check xem hashedPassword sau khi được  sau khi user sign in có giống với storedHashedPassword trong database hay không
    if (hashedPassword.toString('hex') !== storedHashedPassword) {
      // chuyển hashedPassword về dạng string bình thường
      throw new BadRequestException('please check your password again');
    } else {
      return user;
    }
  }
}
