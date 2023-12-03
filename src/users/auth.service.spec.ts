import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  // define 'service' as a global scope
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // users = an array of all User entities
    const users: User[] = [];  
    // create the fake copy of UsersService
    fakeUsersService = {
        findAllUsersWithTheGivenEmail: (email: string) => {
          const filteredUser = users.filter((user) => user.email === email);
          return Promise.resolve(filteredUser);
        },
        createUser: (email: string, password: string) => {
          const user = { id: Math.floor(Math.random() * 999), email, password } as User;
          users.push(user);
          return Promise.resolve(user);
        },
      };

    // create a new DI container
    const module = await Test.createTestingModule({
      providers: [
        // look at the AuthService class, see what's inside it
        AuthService,
        {
          provide: UsersService, // if anyone asks for a copy of UsersService
          useValue: fakeUsersService, // then give them the value fakeUsersService
        },
      ],
    }).compile();

    // create an instance of AuthService
    service = module.get(AuthService);
  });



  it('creates an instance of auth service', async () => {
    // expect 'service' to be defined (if it doesnt have the dependencies defined, there will be an error)
    expect(service).toBeDefined();
  });


  // we want findAllUsers() method to return an empty array in this case => Promise.resolve([])
  // if it returns an array with a user's information: => Promise.resolve([{email: 'we0004119', password: 'otq3ks8q'}]), 'email in use' error will be thrown 
  it('creates a new user with a salted and hashed password', async () => {
    const userSavedToDatabase = await service.signup('thanhluannguyenxyz@gmail.com', 'randompassword');

    // check to make sure that the password has already been hashed
    expect(userSavedToDatabase.password).not.toEqual('randompassword');
    const [salt, hashedPassword] = userSavedToDatabase.password.split('.');
    expect(salt).toBeDefined();
    expect(hashedPassword).toBeDefined;
  })


  // But in this case, we want the findAllUsers() method to return an array with user's information inside it
  // For the error to be thrown (Because if it can find the email stored in the database)
  // =>> And return that user's information to the array =>> meaning the user has already existed in the database =>> throw an error
  it('throws an error if user signs up with an email that is already in use', async () => {

    await service.signup('thanhluannguyenxyz@gmail.com', 'randompassword');
    await expect(service.signup('thanhluannguyenxyz@gmail.com', 'randompassword')).rejects.toThrow(
      BadRequestException,
    );
  })


  // In this case, findAllUsers() method should return an empty array [], so the condition of the existing correct email is not met
  // =>> fail =>> throw an error
  it('throws if user signs in with an incorrect email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });



  it('throws if an invalid password is provided', async () => {
    
    await service.signup('laskdjf@alskdfj.com', 'passowr');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
    
  });


  it('returns a user if the correct password is provided', async () => {
    await service.signup('dumbemail@gmail.com', 'canhsat113');

    const signedInUser = await service.signin('dumbemail@gmail.com', 'canhsat113');
    expect(signedInUser).toBeDefined();
  })
});
