import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: Partial<UsersController>;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneUser: (id: number) => {
        return Promise.resolve({id: id, email: 'we00043701@gmail.com', password: 'randompassword1'} as User);
      },
      findAllUsersWithTheGivenEmail: (emai: string) => {
        return Promise.resolve([{id: 1, email: emai, password: 'abcxyz'} as User]); // return an array of Users so it needs []
      },
      // removeUser: (id: number) => {
      //   return Promise.resolve(id, email: 'randomid2', password: 'randompassword2')
      // },
      // updateUser: () => {}
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (mai: string, pass: string) => {
        return Promise.resolve({id: 1, email: mai, password: pass } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },

        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsersWithTheGivenEmailFinal returns a list of users with the given email', async () => {
    const users = await controller.findAllUsersWithTheGivenEmailFinal('abcxyz@gmail.com'); // return an array of users with the given email
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abcxyz@gmail.com');
  })

  it('findOneUser returns a user with the given id', async () => {
    const user = await controller.findOneUserFinal('1');
    expect(user).toBeDefined();
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOneUser = () => Promise.reject(new NotFoundException('user not found'));
    await expect(controller.findOneUserFinal('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: 2};
    const user = await controller.userSignIn({email: 'we00043701@gmail.com', password: 'otq3ks8q'}, session)
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
