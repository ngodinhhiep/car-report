import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ParseNumberMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    const { price, year, mileage, phone } = req.body || {};
    req.body.price = Number(price);
    req.body.year = Number(year);
    req.body.mileage = Number(mileage);
    req.body.phone = Number(phone)
    next();
  }
}