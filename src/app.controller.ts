import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  rootPage(@Res() res: Response) {
    return res.render('homepage.hbs', {});

    // or it can be
  // return res.render('template', {});
  }

}
