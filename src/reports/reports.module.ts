import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { Car } from '../cars/car.entity';
import { MiddlewareConsumer } from '@nestjs/common';
import { ParseNumberMiddleware } from 'src/users/middlewares/parseNumber.middleware';
import { CarsService } from '../cars/cars.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Car])],
  controllers: [ReportsController],
  providers: [ReportsService, UsersService, CarsService]
})
export class ReportsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseNumberMiddleware).forRoutes('*')
  }
}
