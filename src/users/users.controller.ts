import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Session,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ReportsService } from 'src/reports/reports.service';
import { CarsService } from 'src/cars/cars.service';

// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { User } from './user.entity';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private reportsService: ReportsService,
    private carsService: CarsService,
  ) {}


  // @Get('/all_users')
  // @UseGuards(AdminGuard)
  // async getAllUsersAndReports(@Res() res: Response) {
  //   const allUsers = await this.usersService.findAllUsers();
  //   const allReports = await this.reportsService.getAllReports();
  //   return res.render('admin_page', {allUsers})
  // }

  // Admin goes into a form new user
  @Get('/add_user_form')
  @UseGuards(AdminGuard)
  async adminAddNewUserForm(@Res() res: Response) {
    return res.render('admin-add-new-user', {});
  }

  // common user register request
  async common(commonBody: CreateUserDto) {
    const admin = !!commonBody.admin || false; // Convert the checkbox value from 'on' or 'off' to a boolean or default to false
    return this.authService.signup(
      commonBody.email,
      commonBody.password,
      commonBody.username,
      commonBody.address,
      commonBody.phone,
      admin,
    );
  }

  // User Signup
  @Post('/signup')
  async userSignUp(@Body() body: CreateUserDto, @Res() res: Response) {
    const user = await this.common(body);
    return res.render('signup-page', {});
  }

  @Post('/signin')
  async userSignIn(
    @Body() body: Partial<CreateUserDto>,
    @Session() seSSion: any,
    @Res() res: Response,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    seSSion.userId = user.id;
    // const allCurrentUserReports =
    //   await this.reportsService.getAllCurrentUserReports(user.id);
    if (user.admin) {
      res.redirect('/auth/admin');
    } else {
      res.redirect('/auth/user');
    }
  }

  @Get('/signout') // log out the main page
  userSignOut(@Session() seSSion: any, @Res() res: Response) {
    seSSion.userId = null;
    return res.redirect('/');
  }

  // Admin add a new user
  @Post('/add_user')
  @UseGuards(AuthGuard)
  async adminAddNewUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const newUser = await this.common(body);
    return res.redirect('/auth/admin');
  }

  // admin page (to have an all-users view)
  @Get('/admin')
  @UseGuards(AuthGuard)
  async adminPage(@Res() res: Response) {
    const allUsers = await this.usersService.findAllUsers();
    return res.render('admin_page', { allUsers });
  }

  // user page (to have an all-cars view)
  @Get('/user')
  @UseGuards(AuthGuard)
  async userPage(@Res() res: Response) {
    const carList = await this.carsService.getAllCarsInfo()
    return res.render('user_page', {carList});
  }



  // go to the update user form
  @Get('/update_user/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: string, @Res() res: Response) {
    const updatedUser = await this.usersService.findOneUser(parseInt(id));
    return res.render('update_users_page', { updatedUser });
  }

  // @Get('/:id')
  // findOneUserFinal(@Param('id') id: string) {
  //   const user = this.usersService.findOneUser(parseInt(id));
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return user;
  // }

  @Get()
  async findAllUsersWithTheGivenEmailFinal(
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    const users = await this.usersService.findAllUsersWithTheGivenEmail(email);
    return res.render('view_user_page', { users });
  }

  // Admin Deletes User
  @Post('/delete_user/:id')
  removeUserFinal(@CurrentUser() user: User, @Param('id') id: string, @Res() res: Response) {
    if(user.admin){
      const deletedUser = this.usersService.removeUser(parseInt(id));
      return res.redirect('/auth/admin');
    }
  }

  // admin update user
  @Post('/update/:id')
  @UseGuards(AdminGuard)
  async updateUserFinal(
    @Param('id') id: string,
    @Body() body: updateUserDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    if(user.admin) {
      const updatedUser = await this.usersService.updateUser(parseInt(id), body);
      return res.redirect('/auth/admin');
    }
  }
}
