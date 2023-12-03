import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  
  mainPage(): string {
    return 'main_page';
  }

  signUpPage(): string {
    return 'signup-page';
  }

  signInPage(): string {
    return 'signin-page';
  }

  signOutPage(): string {
    return 'signout-page';
  }

}
